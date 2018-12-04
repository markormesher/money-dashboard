import { NextFunction, Request, RequestHandler, Response } from "express";
import { StatusError } from "../helpers/StatusError";
import { IUser } from "../models/IUser";

const loadUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
	const user = req.user as IUser;
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
		throw new StatusError(401);
	}
};

export {
	loadUser,
	requireUser,
};
