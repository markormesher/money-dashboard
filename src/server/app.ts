import BodyParser = require("body-parser");
import ConnectRedis = require("connect-redis");
import Express = require("express");
import { NextFunction, Request, Response } from "express";
import ExpressSession = require("express-session");
import Passport = require("passport");
import { StatusError } from "./extensions/StatusError";
import { getSecret, runningInDocker } from "./helpers/config-loader";
import SequelizeDb = require("./helpers/db");
import { logger } from "./helpers/logging";
import PassportConfig = require("./helpers/passport-config");
import { setupApiRoutes } from "./middleware/api-routes";
import { setupDevAppRoutes, setupProdAppRoutes } from "./middleware/app-routes";

const app = Express();

// TODO: some API routes generate the following warning when called with POST but not GET
// Warning: a promise was created in a handler at ... but was not returned from it, see http://goo.gl/rRqMUw

// TODO: check whether Redis and Postgres are up

// TODO: major refactoring of server-side

// db connection
SequelizeDb
		.sync({ force: false })
		.then(() => logger.info("Database models synced successfully"))
		.catch((err) => logger.error("Failed to sync database models", err));

// cookies and sessions
const RedisSessionStore = ConnectRedis(ExpressSession);
app.use(ExpressSession({
	store: new RedisSessionStore({ host: runningInDocker() ? "redis" : "localhost" }),
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
if (process.env.NODE_ENV.indexOf("prod") >= 0) {
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
