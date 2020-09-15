import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { requireUser } from "../middleware/auth-middleware";
import { getLatestExchangeRates } from "../managers/exchange-rate-manager";

const router = Express.Router();

router.get("/latest", requireUser, (req: Request, res: Response, next: NextFunction) => {
  getLatestExchangeRates()
    .then((rates) => res.json(rates))
    .catch(next);
});

export { router };
