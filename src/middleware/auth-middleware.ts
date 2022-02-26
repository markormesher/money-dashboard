import { NextFunction, Request, RequestHandler, Response } from "express";
import { logger } from "../utils/logging";
import { StatusError } from "../utils/StatusError";
import { getSecret } from "../config/config-loader";
import { getOrCreateUserWithExternalUsername } from "../managers/user-manager";
import { DbUser } from "../db/models/DbUser";

declare module "express-serve-static-core" {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface Request {
    user: DbUser;
  }
}

const loadUser: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const username = req.header("remote-user");
  const name = req.header("remote-name");
  if (!username || !name) {
    logger.error("Username or name was missing from request", { headers: req.headers });
    throw new StatusError(401);
  }

  getOrCreateUserWithExternalUsername(username, name).then((user) => {
    req.user = user;
    next();
  });
};

const requireCronAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization === getSecret("cron.secret")) {
    next();
  } else {
    throw new StatusError(401);
  }
};

export { loadUser, requireCronAuth };
