import { NextFunction, Request, RequestHandler, Response } from "express";
import { logger } from "../utils/logging";
import { StatusError } from "../utils/StatusError";
import { getOrCreateUserWithExternalUsername } from "../managers/user-manager";
import { DbUser } from "../db/models/DbUser";

declare module "express-serve-static-core" {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Request {
    user: DbUser;
  }
}

const loadUser: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  const username = req.header("remote-user") ?? "mormesher";
  const name = req.header("remote-name") ?? "Mark Ormesher";
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
