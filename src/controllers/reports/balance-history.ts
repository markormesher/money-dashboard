import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { startOfDay, endOfDay } from "date-fns";
import { DateModeOption } from "../../models/ITransaction";
import { DbUser } from "../../db/models/DbUser";
import { getBalanceHistoryReportData } from "../../managers/reports/balance-history";

const router = Express.Router();

router.get("/data", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const startDate = startOfDay(parseInt(req.query.startDate as string)).getTime();
  const endDate = endOfDay(parseInt(req.query.endDate as string)).getTime();
  const dateMode = req.query.dateMode as DateModeOption;

  getBalanceHistoryReportData(user, startDate, endDate, dateMode)
    .then((data) => res.json(data))
    .catch(next);
});

export { router };
