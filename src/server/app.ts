import * as BodyParser from "body-parser";
import * as ConnectRedis from "connect-redis";
import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import * as ExpressSession from "express-session";
import * as Passport from "passport";
import { getSecret, runningInDocker } from "./helpers/config-loader";
import { SequelizeDb } from "./helpers/db";
import { logger } from "./helpers/logging";
import * as PassportConfig from "./helpers/passport-config";
import { StatusError } from "./helpers/StatusError";
import { setupApiRoutes } from "./middleware/api-routes";
import { setupDevAppRoutes, setupProdAppRoutes } from "./middleware/app-routes";

const app = Express();

// TODO: lots of API routes intermittently generate this warning; 95% sure it's from a lib, not this code
// Warning: a promise was created in a handler at ... but was not returned from it, see http://goo.gl/rRqMUw

// TODO: check whether Redis and Postgres are up

// TODO: major refactoring of server-side

// TODO: tidy up models and model-thins (combine if possible)

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
