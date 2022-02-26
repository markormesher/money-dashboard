import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { endOfDay, startOfDay } from "date-fns";
import { DateModeOption } from "../../../commons/models/ITransaction";
import { DbUser } from "../../db/models/DbUser";
import { getAssetPerformanceReportData } from "../../managers/reports/asset-performance";

const router = Express.Router();

router.get("/data", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const startDate = startOfDay(parseInt(req.query.startDate)).getTime();
  const endDate = endOfDay(parseInt(req.query.endDate)).getTime();
  const dateMode: DateModeOption = req.query.dateMode;
  const selectedAccounts: string[] = req.query.selectedAccounts || [];
  const zeroBasis: boolean = req.query.zeroBasis === "true";
  const showAsPercent: boolean = req.query.showAsPercent === "true";

  getAssetPerformanceReportData(user, startDate, endDate, dateMode, selectedAccounts, zeroBasis, showAsPercent)
    .then((data) => res.json(data))
    .catch(next);
});

export { router };
