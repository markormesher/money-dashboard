import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { endOfDay, startOfDay } from "date-fns";
import { IAssetPerformanceData } from "../../../commons/models/IAssetPerformanceData";
import { DateModeOption } from "../../../commons/models/ITransaction";
import { DbTransaction } from "../../db/models/DbTransaction";
import { DbUser } from "../../db/models/DbUser";
import { getTransactionQueryBuilder } from "../../managers/transaction-manager";
import { requireUser } from "../../middleware/auth-middleware";

const router = Express.Router();

router.get("/data", requireUser, (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const startDate = startOfDay(parseInt(req.query.startDate)).getTime();
  const endDate = endOfDay(parseInt(req.query.endDate)).getTime();
  const dateMode: DateModeOption = req.query.dateMode;
  const dateField = `${dateMode}Date`;
  const selectedAccounts: string[] = req.query.selectedAccounts || [];
  const zeroBasis: boolean = req.query.zeroBasis === "true";
  const showAsPercent: boolean = req.query.showAsPercent === "true";

  const getTransactionsBeforeRange = getTransactionQueryBuilder({ withAccount: true, withCategory: true })
    .where("transaction.profile_id = :profileId")
    .andWhere(`transaction.${dateField} < :startDate`)
    .andWhere(`transaction.deleted = FALSE`)
    .andWhere(`account.id IN (:...selectedAccounts)`)
    .setParameters({
      profileId: user.activeProfile.id,
      startDate,
      selectedAccounts: [null, ...selectedAccounts], // null fixes issues with empty arrays
    });

  const getTransactionsInRange = getTransactionQueryBuilder({ withAccount: true, withCategory: true })
    .where("transaction.profile_id = :profileId")
    .andWhere(`transaction.${dateField} >= :startDate`)
    .andWhere(`transaction.${dateField} <= :endDate`)
    .andWhere(`transaction.deleted = FALSE`)
    .andWhere(`account.id IN (:...selectedAccounts)`)
    .orderBy(`transaction.${dateField}`, "ASC")
    .setParameters({
      profileId: user.activeProfile.id,
      startDate,
      endDate,
      selectedAccounts: [null, ...selectedAccounts], // null fixes issues with empty arrays
    });

  Promise.all([getTransactionsBeforeRange.getMany(), getTransactionsInRange.getMany()])
    .then(([transactionsBeforeRange, transactionsInRange]) => {
      const dataInclGrowth: Array<{ x: number; y: number }> = [];
      const dataExclGrowth: Array<{ x: number; y: number }> = [];

      let runningTotalInclGrowth = transactionsBeforeRange.map((t) => t.amount).reduce((a, b) => a + b, 0);
      let runningTotalExclGrowth = transactionsBeforeRange
        .filter((t) => !t.category.isAssetGrowthCategory)
        .map((t) => t.amount)
        .reduce((a, b) => a + b, 0);

      let lastDate = 0;

      let totalChangeInclGrowth = 0;
      let totalChangeExclGrowth = 0;

      const takeValues = (): void => {
        if (zeroBasis) {
          if (showAsPercent) {
            dataInclGrowth.push({
              x: lastDate,
              y:
                runningTotalExclGrowth !== 0
                  ? (runningTotalInclGrowth - runningTotalExclGrowth) / runningTotalExclGrowth
                  : 0,
            });
          } else {
            dataInclGrowth.push({
              x: lastDate,
              y: runningTotalInclGrowth - runningTotalExclGrowth,
            });
          }
          dataExclGrowth.push({ x: lastDate, y: 0 });
        } else {
          dataInclGrowth.push({ x: lastDate, y: runningTotalInclGrowth });
          dataExclGrowth.push({ x: lastDate, y: runningTotalExclGrowth });
        }
      };

      transactionsInRange.forEach((transaction: DbTransaction) => {
        const rawDate = dateMode === "effective" ? transaction.effectiveDate : transaction.transactionDate;
        const date = startOfDay(rawDate).getTime();
        if (lastDate > 0 && lastDate !== date) {
          takeValues();
        }

        lastDate = date;
        runningTotalInclGrowth += transaction.amount;
        totalChangeInclGrowth += transaction.amount;
        if (!transaction.category.isAssetGrowthCategory) {
          runningTotalExclGrowth += transaction.amount;
          totalChangeExclGrowth += transaction.amount;
        }
      });

      if (lastDate > 0) {
        takeValues();
      }

      const result: IAssetPerformanceData = {
        dataExclGrowth,
        dataInclGrowth,
        totalChangeInclGrowth,
        totalChangeExclGrowth,
        zeroBasis,
        showAsPercent,
      };

      res.json(result);
    })
    .catch(next);
});

export { router };
