import * as BodyParser from "body-parser";
import * as ConnectRedis from "connect-redis";
import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as ExpressSession from "express-session";
import * as Passport from "passport";
import "reflect-metadata";
import { createConnection } from "typeorm";
import { typeormConf } from "./db/db-config";
import { getSecret, isProd } from "./helpers/config-loader";
import { logger } from "./helpers/logging";
import * as PassportConfig from "./helpers/passport-config";
import { StatusError } from "./helpers/StatusError";
import { setupApiRoutes } from "./middleware/api-routes";
import { setupDevAppRoutes, setupProdAppRoutes } from "./middleware/app-routes";

const app = Express();

// db connection
createConnection({ ...typeormConf, synchronize: false })
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
if (isProd()) {
	setupProdAppRoutes(app);
} else {
	setupDevAppRoutes(app);
}

// error handlers
// noinspection JSUnusedLocalSymbols
app.use((error: StatusError, req: Request, res: Response, next: NextFunction) => {
	const status = error.status || 500;
	const name = error.name || error.message || "Internal Server Error";
	logger.error(`Error: ${name}`, error);
	res.status(status).json(error);
});

// go!
const server = app.listen(3000, () => logger.info("Listening on port 3000"));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
