import BodyParser = require('body-parser');
import ConnectRedis = require('connect-redis');
import Express = require('express');
import ExpressFlash = require('express-flash-2');
import ExpressSession = require('express-session');
import Passport = require('passport');
import SequelizeDb = require('./helpers/db');
import PassportConfig = require('./helpers/passport-config');
import { NextFunction, Request, Response } from 'express';
import { join } from 'path';
import { StatusError } from './extensions/StatusError';
import { getSecret } from "./helpers/config-loader";
import { formatterMiddleware } from "./public/global/formatters";

const app = Express();

// db connection
SequelizeDb.sync({ force: false }).then(() => {
	console.log('Database models synced successfully');
}).catch(err => {
	console.log('Failed to sync database models');
	console.log(err);
});

// form body content
app.use(BodyParser.urlencoded({ extended: false }));

// cookies and sessions
const RedisSessionStore = ConnectRedis(ExpressSession);
app.use(ExpressSession({
	store: new RedisSessionStore({ host: 'redis' }),
	secret: getSecret('session.secret'),
	resave: false,
	saveUninitialized: false
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
app.use('/', require('./controllers/dashboard'));
app.use('/auth', require('./controllers/auth'));
app.use('/settings/accounts', require('./controllers/settings/accounts'));
app.use('/settings/budgets', require('./controllers/settings/budgets'));
app.use('/settings/categories', require('./controllers/settings/categories'));
app.use('/settings/profiles', require('./controllers/settings/profiles'));
app.use('/transactions', require('./controllers/transactions'));

// views
app.set('views', join(__dirname, '../views'));
app.set('view engine', 'pug');

// static files
app.use(Express.static(join(__dirname, 'public')));
app.use(Express.static(join(__dirname, '../assets')));
[
	'bootstrap',
	'bootstrap-progressbar',
	'datatables.net',
	'datatables.net-bs',
	'gentelella',
	'jquery',
	'jquery-validation',
	'toastr'
].forEach(lib => {
	app.use(`/_npm/${lib}`, Express.static(join(__dirname, `../node_modules/${lib}`)));
});

// error handlers
app.use((req: Request, res: Response, next: NextFunction) => {
	const err = new StatusError(`Could not find ${req.path}`);
	err.name = 'Not Found';
	err.status = 404;
	next(err);
});
app.use((error: StatusError, req: Request, res: Response, next: NextFunction) => {
	const status = error.status || 500;
	const name = error.name || error.message || 'Internal Server Error';
	let message = error.message || 'Internal Server Error';
	if (name === message) {
		message = undefined;
	}

	console.log(error);

	res.status(status);
	res.render('_shared/error', {
		_: {
			title: status + ': ' + name
		},
		name: name,
		message: message,
		status: status,
		error: process.env.ENV === 'dev' ? error : ''
	});
});

// go!
const server = app.listen(3000, () => console.log('Listening on port 3000'));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
