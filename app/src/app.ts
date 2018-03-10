import BodyParser = require("body-parser");
import ConnectRedis = require("connect-redis");
import Express = require("express");
import { NextFunction, Request, Response } from "express";
import ExpressFlash = require("express-flash-2");
import ExpressSession = require("express-session");
import Passport = require("passport");
import { join } from "path";
import Winston = require("winston");

import AuthController = require("./controllers/auth");
import DashboardController = require("./controllers/dashboard");
import AccountSettingsController = require("./controllers/settings/accounts");
import BudgetSettingsController = require("./controllers/settings/budgets");
import TransactionsController = require("./controllers/settings/categories");
import CategorySettingsController = require("./controllers/settings/categories");
import ProfileSettingsController = require("./controllers/settings/categories");

import { StatusError } from "./extensions/StatusError";
import { getSecret } from "./helpers/config-loader";
import SequelizeDb = require("./helpers/db");
import PassportConfig = require("./helpers/passport-config");
import { formatterMiddleware } from "./public/js/global/formatters";

const app = Express();

// logging
Winston.level = "debug";

// db connection
SequelizeDb.sync({ force: false }).then(() => {
	Winston.info("Database models synced successfully");
}).catch((err) => {
	Winston.error("Failed to sync database models", err);
});

// form body content
app.use(BodyParser.urlencoded({ extended: false }));

// cookies and sessions
const RedisSessionStore = ConnectRedis(ExpressSession);
app.use(ExpressSession({
	store: new RedisSessionStore({ host: "redis" }),
	secret: getSecret("session.secret"),
	resave: false,
	saveUninitialized: false,
}));

// flash messages
app.use(ExpressFlash());

// formatters
app.use(formatterMiddleware);

// auth TODO: prevent user query for non-auth requests
PassportConfig.init(Passport);
app.use(Passport.initialize());
app.use(Passport.session());

// controllers
app.use("/", DashboardController);
app.use("/auth", AuthController);
app.use("/settings/accounts", AccountSettingsController);
app.use("/settings/budgets", BudgetSettingsController);
app.use("/settings/categories", CategorySettingsController);
app.use("/settings/profiles", ProfileSettingsController);
app.use("/transactions", TransactionsController);

// views
app.set("views", join(__dirname, "../views"));
app.set("view engine", "pug");

// static files
app.use(Express.static(join(__dirname, "public")));
app.use(Express.static(join(__dirname, "../assets")));
[
	"bootstrap",
	"bootstrap-progressbar",
	"datatables.net",
	"datatables.net-bs",
	"gentelella",
	"jquery",
	"jquery-validation",
	"toastr",
].forEach((lib) => {
	app.use(`/_npm/${lib}`, Express.static(join(__dirname, `../node_modules/${lib}`)));
});

// error handlers
app.use((req: Request, res: Response, next: NextFunction) => {
	const err = new StatusError(`Could not find ${req.path}`);
	err.name = "Not Found";
	err.status = 404;
	next(err);
});
app.use((error: StatusError, req: Request, res: Response, next: NextFunction) => {
	const status = error.status || 500;
	const name = error.name || error.message || "Internal Server Error";
	let message = error.message || "Internal Server Error";
	if (name === message) {
		message = undefined;
	}

	Winston.error(`Error: ${name}`, error);

	res.status(status);
	res.render("_shared/error", {
		_: {
			title: status + ": " + name,
		},
		name,
		message,
		status,
		error: process.env.ENV === "dev" ? error : "",
	});
});

// go!
const server = app.listen(3000, () => Winston.info("Listening on port 3000"));
process.on("SIGTERM", () => server.close(() => process.exit(0)));
