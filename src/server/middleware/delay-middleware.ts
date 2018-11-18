import { NextFunction, Request, RequestHandler, Response } from "express";

function delay(time: number): RequestHandler {
	return (req: Request, res: Response, next: NextFunction) => {
		setTimeout(next, time);
	};
}

export {
	delay,
};
