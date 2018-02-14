import {Request, Response, NextFunction, RequestHandler} from 'express';
import {User} from "../models/User";
import {Profile} from "../models/Profile";

const loadUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as User;
	if (user) {
		res.locals.user = user;
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
