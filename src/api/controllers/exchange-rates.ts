import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { requireUser, requireCronAuth } from "../middleware/auth-middleware";
import {
  getLatestExchangeRates,
  updateLatestExchangeRates,
  updateHistoricalExchangeRages,
  updateExchangeRates,
} from "../managers/exchange-rate-manager";

const router = Express.Router();

router.get("/latest", requireUser, (req: Request, res: Response, next: NextFunction) => {
  getLatestExchangeRates()
    .then((rates) => res.json(rates))
    .catch(next);
});

router.post("/update-historical", requireCronAuth, (req: Request, res: Response, next: NextFunction) => {
  const days = parseInt(req.query["days"] as string) || 2;
  updateHistoricalExchangeRages(days)
    .then(() => res.status(200).send())
    .catch(next);
});

router.post("/update-latest", requireCronAuth, (req: Request, res: Response, next: NextFunction) => {
  updateLatestExchangeRates()
    .then(() => res.status(200).send())
    .catch(next);
});

router.post("/update-specific/:date", requireCronAuth, (req: Request, res: Response, next: NextFunction) => {
  const date = req.params.date;
  updateExchangeRates(date)
    .then(() => res.status(200).send())
    .catch(next);
});

export { router };
