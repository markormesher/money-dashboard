import * as BodyParser from "body-parser";
import * as Express from "express";
import { Request, Response } from "express";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { StatusError } from "../commons/StatusError";
import { logger, ensureLogFilesAreCreated } from "../commons/utils/logging";
import { runningInDocker } from "../commons/utils/env";
import { delayPromise } from "../commons/utils/utils";
import { typeormConf } from "./db/db-config";
import { MigrationRunner } from "./db/migrations/MigrationRunner";
import { setupApiRoutes } from "./middleware/api-routes";
import { loadUser } from "./middleware/auth-middleware";

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

  // middleware
  app.use(BodyParser.json());
  app.use(loadUser);

  // routes
  setupApiRoutes(app);
  // setupClientRoutes(app);

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
