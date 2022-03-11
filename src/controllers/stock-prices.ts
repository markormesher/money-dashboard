import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { getLatestStockPrices } from "../managers/stock-price-manager";

const router = Express.Router();

router.get("/latest", (req: Request, res: Response, next: NextFunction) => {
  getLatestStockPrices()
    .then((prices) => res.json(prices))
    .catch(next);
});

export { router };
