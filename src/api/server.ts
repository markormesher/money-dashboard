import * as BodyParser from "body-parser";
import * as ConnectRedis from "connect-redis";
import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as ExpressSession from "express-session";
import * as Passport from "passport";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { StatusError } from "../commons/StatusError";
import { logger } from "../commons/utils/logging";
import { getSecret } from "./config/config-loader";
import { typeormConf } from "./db/db-config";
import * as PassportConfig from "./helpers/passport-config";
import { setupApiRoutes } from "./middleware/api-routes";

const app = Express();

// db connection
createConnection({ ...typeormConf, synchronize: true })
		.then(() => logger.info("Database connection created successfully"))
		.catch((err) => logger.error("Failed to connect to database", err));

// cookies and sessions
const RedisSessionStore = ConnectRedis(ExpressSession);
app.use(ExpressSession({
	store: new RedisSessionStore({ host: "redis" }),
	secret: getSecret("session.secret"),
	resave: false,
	saveUninitialized: false,
}));

// auth
PassportConfig.init(Passport);
app.use(Passport.initialize());
app.use(Passport.session());

// middleware
app.use(BodyParser.json());

// routes
setupApiRoutes(app);

// error handlers
// noinspection JSUnusedLocalSymbols
app.use((error: StatusError, req: Request, res: Response, next: NextFunction) => {
	const status = error.status || 500;
	const name = error.name || error.message || "Internal Server Error";
	logger.error(`Error: ${name}`, { error });
	res.status(status).json(error);
});

// go!
const port = 3000;
const server = app.listen(port, () => logger.info(`API server listening on port ${port}`));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
