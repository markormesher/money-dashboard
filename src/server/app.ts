import BodyParser = require("body-parser");
import ConnectRedis = require("connect-redis");
import Express = require("express");
import { NextFunction, Request, Response } from "express";
import ExpressFlash = require("express-flash-2");
import ExpressSession = require("express-session");
import Passport = require("passport");
import { join } from "path";

import { StatusError } from "./extensions/StatusError";
import { getSecret, runningInDocker } from "./helpers/config-loader";
import SequelizeDb = require("./helpers/db");
import { formatterMiddleware } from "./helpers/formatters";
import { logger } from "./helpers/logging";
import PassportConfig = require("./helpers/passport-config");
import { setupApiRoutes } from "./middleware/api-routes";
import { setupDevAppRoutes, setupProdAppRoutes } from "./middleware/app-routes";

const app = Express();

// TODO: some API routes generate the following warning when called with POST but not GET
// Warning: a promise was created in a handler at ... but was not returned from it, see http://goo.gl/rRqMUw

// TODO: check whether Redis and Postgres are up

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

// front-end dependencies
app.use(Express.static(join(__dirname, "../assets")));
[
	"bootstrap",
	"bootstrap-progressbar",
	"chartist",
	"datatables.net",
	"datatables.net-bs",
	"daterangepicker",
	"gentelella",
	"jquery",
	"jquery-ui-dist",
	"jquery-validation",
	"moment",
	"toastr",
].forEach((lib) => {
	app.use(`/_npm/${lib}`, Express.static(join(__dirname, `../node_modules/${lib}`)));
});

// middleware
app.use(BodyParser.urlencoded({ extended: false }));
app.use(ExpressFlash());
app.use(formatterMiddleware);

// routes
setupApiRoutes(app);
if (process.env.NODE_ENV.indexOf("prod") >= 0) {
	setupProdAppRoutes(app);
} else {
	setupDevAppRoutes(app);
}

// views TODO: deprecate
app.use(Express.static(join(__dirname, "public")));
app.set("views", join(__dirname, "../views"));
app.set("view engine", "pug");

// error handlers
// noinspection JSUnusedLocalSymbols
app.use((error: StatusError, req: Request, res: Response, next: NextFunction) => {
	const status = error.status || 500;
	const name = error.name || error.message || "Internal Server Error";

	logger.error(`Error: ${name}`, error);

	res.status(status);
	res.json(error);
});

// go!
const server = app.listen(3000, () => logger.info("Listening on port 3000"));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
