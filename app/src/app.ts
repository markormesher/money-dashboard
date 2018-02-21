import Path = require('path')
import Express = require('express')
import BodyParser = require('body-parser')
import {Request, Response, NextFunction} from 'express';
import ExpressSession = require('express-session');
import ExpressFlash = require('express-flash-2');
import Passport = require('passport');
import NodeSassMiddleware = require('node-sass-middleware');
import ConfigLoader = require('./helpers/config-loader');
import PassportConfig = require('./helpers/passport-config');
import SequelizeDb = require('./helpers/db');
import {StatusError} from './extensions/StatusError';

const app = Express();

// db connection
SequelizeDb.sync({force: false}).then(() => {
	console.log('Database models synced successfully');
}).catch(err => {
	console.log('Failed to sync database models');
	console.log(err);
});

// form body content
app.use(BodyParser.urlencoded({extended: false}));

// sass conversion
app.use(NodeSassMiddleware({
	src: Path.join(__dirname, '../assets/'),
	dest: Path.join(__dirname, '/public'),
	outputStyle: 'compressed'
}));

// cookies and sessions
app.use(ExpressSession({
	secret: ConfigLoader.getSecret('session.secret'),
	resave: false,
	saveUninitialized: false
}));

// flash messages
app.use(ExpressFlash());

// auth
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

// kill favicon requests
app.use('/favicon.ico', (req: Request, res: Response) => res.end());

// views
app.set('views', Path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// static files
app.use(Express.static(Path.join(__dirname, 'public')));
app.use(Express.static(Path.join(__dirname, '../assets')));
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
	app.use(`/_npm/${lib}`, Express.static(Path.join(__dirname, `../node_modules/${lib}`)));
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
