import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { getLatestExchangeRates } from "../managers/exchange-rate-manager";

const router = Express.Router();

router.get("/latest", (req: Request, res: Response, next: NextFunction) => {
  getLatestExchangeRates()
    .then((rates) => res.json(rates))
    .catch(next);
});

export { router };
