import * as BodyParser from "body-parser";
import * as Express from "express";
import { Request, Response } from "express";
import * as Cron from "node-cron";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { StatusError } from "./utils/StatusError";
import { logger, ensureLogFilesAreCreated } from "./utils/logging";
import { runningInDocker } from "./utils/env";
import { delayPromise } from "./utils/utils";
import { typeormConf } from "./db/db-config";
import { MigrationRunner } from "./db/migrations/MigrationRunner";
import { setupApiRoutes } from "./middleware/api-routes";
import { setupClientRoutes } from "./middleware/client-routes";
import { loadUser } from "./middleware/auth-middleware";
import { updateLatestExchangeRates, updateHistoricalExchangeRages } from "./managers/exchange-rate-manager";
import { updateNextMissingStockPrice } from "./managers/stock-price-manager";

(async function(): Promise<void> {
  const app = Express();

  if (!runningInDocker()) {
    throw new Error("This app is designed to be run in a Docker container");
  }

  // logging
  ensureLogFilesAreCreated();

  // DB connectivity
  logger.info("Checking whether database is available...");
  for (;;) {
    try {
      const conn = await createConnection({ ...typeormConf, synchronize: false });
      logger.info("Database is available");
      await conn.close();
      break;
    } catch {
      logger.error("Couldn't connect to database, retrying in 10s");
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

  // regular tasks
  Cron.schedule("0 */2 * * *", updateLatestExchangeRates);
  Cron.schedule("0 2 * * *", () => updateHistoricalExchangeRages(7));
  Cron.schedule("* * * * *", updateNextMissingStockPrice);

  // middleware
  app.use(BodyParser.json());
  app.use(loadUser);

  // routes
  setupApiRoutes(app);
  setupClientRoutes(app);

  // error handlers
  app.use((error: StatusError, req: Request, res: Response) => {
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
