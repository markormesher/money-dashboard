import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { requireUser } from "../middleware/auth-middleware";
import {
  getLatestExchangeRates,
  updateLatestExchangeRates,
  updateHistoricalExchangeRages,
} from "../managers/exchange-rate-manager";

const router = Express.Router();

router.get("/latest", requireUser, (req: Request, res: Response, next: NextFunction) => {
  getLatestExchangeRates()
    .then((rates) => res.json(rates))
    .catch(next);
});

// TODO: cron auth
router.post("/update-historical", (req: Request, res: Response, next: NextFunction) => {
  const days = parseInt(req.query["days"] as string) || 2;
  updateHistoricalExchangeRages(days)
    .then(() => res.status(200).send())
    .catch(next);
});

// TODO: cron auth
router.post("/update-latest", (req: Request, res: Response, next: NextFunction) => {
  updateLatestExchangeRates()
    .then(() => res.status(200).send())
    .catch(next);
});

export { router };
