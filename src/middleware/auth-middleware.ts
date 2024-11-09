import { NextFunction, Request, RequestHandler, Response } from "express";
import { logger } from "../utils/logging";
import { StatusError } from "../utils/StatusError";
import { getOrCreateUserWithExternalUsername } from "../managers/user-manager";
import { DbUser } from "../db/models/DbUser";
import { isDev } from "../utils/env";

declare global {
  namespace Express {
    export interface Request {
      user: DbUser;
    }
  }
}

const loadUser: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  let username = req.header("remote-user");
  let name = req.header("remote-name");

  if (isDev()) {
    username = username ?? "mormesher";
    name = name ?? "Mark Ormesher";
  }

  if (!username || !name) {
    logger.error("Username or name was missing from request", { headers: req.headers });
    throw new StatusError(401);
  }

  getOrCreateUserWithExternalUsername(username, name).then((user) => {
    req.user = user;
    next();
  });
};

export { loadUser };
