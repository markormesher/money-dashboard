import _ = require('lodash');
import {Request, Response, NextFunction, RequestHandler} from 'express';

const loadUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
	const user = req.user;
	if (user) {
		res.locals.user = user;
		res.locals.activeProfile = _.filter(user.profiles, (profile) => profile.active)[0];
	} else {
		res.locals.user = undefined;
	}
	next();
};

const requireUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
	if (req.user) {
		loadUser(req, res, next);
	} else {
		res.flash('error', 'You need to log in first.');
		res.redirect('/auth/login');
	}
};

export {loadUser, requireUser};
