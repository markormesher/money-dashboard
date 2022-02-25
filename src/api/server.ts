import * as BodyParser from "body-parser";
import * as ConnectRedis from "connect-redis";
import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as ExpressSession from "express-session";
import * as Redis from "redis";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { StatusError } from "../commons/StatusError";
import { logger } from "../commons/utils/logging";
import { getSecret } from "./config/config-loader";
import { typeormConf } from "./db/db-config";
import { MigrationRunner } from "./db/migrations/MigrationRunner";
import { setupApiRoutes } from "./middleware/api-routes";
import { loadUser } from "./middleware/auth-middleware";

const app = Express();

// db connection
createConnection({ ...typeormConf, synchronize: false })
  .then(() => logger.info("Database connection created successfully"))
  .catch((err) => logger.error("Failed to connect to database", err));

// cookies and sessions
const redisClient = Redis.createClient({
  host: "redis",
  port: 6379,
});
const RedisSessionStore = ConnectRedis(ExpressSession);
app.use(
  ExpressSession({
    store: new RedisSessionStore({ client: redisClient }),
    secret: getSecret("session.secret"),
    resave: false,
    saveUninitialized: false,
  }),
);

// middleware
app.use(BodyParser.json());
app.use(loadUser);

// routes
setupApiRoutes(app);

// error handlers
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: StatusError, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const name = error.name || error.message || "Internal Server Error";
  logger.error(`Error: ${name}`, { error });
  res.status(status).json(error);
});

async function initDb(): Promise<void> {
  // DB migrations
  logger.info("Starting DB migrations");
  const migrationRunner = new MigrationRunner(typeormConf);
  await migrationRunner.runMigrations().then(() => logger.info("Migrations finished"));

  // DB connection
  return createConnection(typeormConf).then(() => {
    logger.info("Database connection created successfully");
  });
}

initDb()
  .then(() => {
    // server start!
    const port = 3000;
    const server = app.listen(port, () => {
      logger.info(`API server listening on port ${port}`);
    });
    process.on("SIGTERM", () => server.close(() => process.exit(0)));
  })
  .catch((err) => {
    logger.error("Failed to initialise API server", err);
    throw err;
  });
