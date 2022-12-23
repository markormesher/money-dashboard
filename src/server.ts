import * as BodyParser from "body-parser";
import * as Express from "express";
import { Request, Response, NextFunction } from "express";
import * as Cron from "node-cron";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { StatusError } from "./utils/StatusError";
import { logger, ensureLogFilesAreCreated } from "./utils/logging";
import { delayPromise } from "./utils/utils";
import { typeormConf } from "./db/db-config";
import { MigrationRunner } from "./db/migrations/MigrationRunner";
import { setupApiRoutes } from "./middleware/api-routes";
import { setupClientRoutes } from "./middleware/client-routes";
import { loadUser } from "./middleware/auth-middleware";
import { updateLatestExchangeRates, updateNextMissingExchangeRates } from "./managers/exchange-rate-manager";
import { updateNextMissingStockPrice, removeRandomNullStockPrices } from "./managers/stock-price-manager";

(async function(): Promise<void> {
  let dbReady = false;
  const app = Express();

  // health endpoint (registered here before we block on setting up the DB)
  app.get("/api/health/live", (req, res) => {
    res.status(200).end();
  });
  app.get("/api/health/ready", (req, res) => {
    res.status(dbReady ? 200 : 500).end();
  });

  // logging
  ensureLogFilesAreCreated();

  // DB connectivity
  logger.info("Checking whether database is available...");
  for (;;) {
    try {
      const conn = await createConnection({ ...typeormConf, synchronize: false });
      logger.info("Database is available");
      dbReady = true;
      await conn.close();
      break;
    } catch (error) {
      logger.error("Couldn't connect to database, retrying in 10s", { error });
      await delayPromise(10000);
    }
  }

  // DB migrations
  logger.info("Starting DB migrations");
  const migrationRunner = new MigrationRunner(typeormConf);
  await migrationRunner.runMigrations();
  logger.info("Migrations finished");

  // DB connection
  logger.info("Creating database connection");
  await createConnection(typeormConf);
  logger.info("Database connection created successfully");

  // regular tasks - stocks (max 5 requests per minute)
  Cron.schedule("0 12 * * *", () => removeRandomNullStockPrices(5));
  Cron.schedule("*/5 * * * *", updateNextMissingStockPrice);

  // regular tasks - exchange rates (max 1000 requests per month)
  Cron.schedule("0 */2 * * *", updateLatestExchangeRates);
  Cron.schedule("30 */2 * * *", updateNextMissingExchangeRates);

  // middleware
  app.use(BodyParser.json());
  app.use(loadUser);

  // routes
  setupApiRoutes(app);
  setupClientRoutes(app);

  // error handlers
  app.use((error: StatusError, req: Request, res: Response, next: NextFunction) => {
    const status = error.status || 500;
    const name = error.name || "Internal Server Error";
    const message = error.message || undefined;
    logger.error(`Error: ${name} - ${message}`, error);
    res.status(status).json({ status, name, message });
  });

  // server start!
  const port = 3000;
  const server = app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
  });
  process.on("SIGTERM", () => server.close(() => process.exit(0)));
})();
