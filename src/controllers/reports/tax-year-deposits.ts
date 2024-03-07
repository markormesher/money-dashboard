import * as Express from "express";
import { NextFunction, Request, Response } from "express";
import { IDetailedCategoryBalance } from "../../models/IDetailedCategoryBalance";
import { ITaxYearDepositsData } from "../../models/ITaxYearDepositsData";
import { DateModeOption, ITransaction } from "../../models/ITransaction";
import { getTaxYear, groupBy } from "../../utils/helpers";
import { DbUser } from "../../db/models/DbUser";
import { getTransactionQueryBuilder } from "../../managers/transaction-manager";
import { AccountTag } from "../../models/IAccount";

const router = Express.Router();

router.get("/data", (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as DbUser;
  const dateMode = req.query.dateMode as DateModeOption;
  const accountTag: AccountTag = req.query.accountTag as AccountTag;

  const getYear = (transaction: ITransaction): number => {
    if (dateMode === "transaction") {
      return getTaxYear(transaction.transactionDate);
    } else {
      return getTaxYear(transaction.effectiveDate);
    }
  };

  // note: the sums here do not consider exchange rates or stock prices

  getTransactionQueryBuilder({ withAccount: true, withCategory: true })
    .where("transaction.profile_id = :profileId")
    .andWhere(":accountTag = ANY(account.tags)")
    .andWhere("transaction.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
      accountTag,
    })
    .getMany()
    .then((transactions) => {
      if (!transactions?.length) {
        return null;
      }

      const allYears = transactions.map((t) => getYear(t)).filter((year, idx, arr) => arr.indexOf(year) === idx);
      const allCategories = transactions
        .map((t) => t.category)
        .filter((cat, idx, arr) => arr.findIndex((c) => c.id === cat.id) === idx);
      const yearData: Record<number, Record<string, IDetailedCategoryBalance>> = {};

      for (const year of allYears) {
        yearData[year] = {};
        const transactionsInYear = transactions.filter((t) => getYear(t) === year);
        const groupedTransactions = groupBy(transactionsInYear, (t) => t.category.id);
        Object.entries(groupedTransactions).map(([categoryId, transactionsForCategory]) => {
          const amounts = transactionsForCategory.map((t) => t.amount);
          yearData[year][categoryId] = {
            category: transactionsForCategory[0].category,
            balanceIn: amounts.filter((a) => a > 0).reduce((a, b) => a + b, 0),
            balanceOut: amounts.filter((a) => a < 0).reduce((a, b) => a + b, 0),
          } as IDetailedCategoryBalance;
        });
      }

      return {
        allYears,
        allCategories,
        yearData,
      } as ITaxYearDepositsData;
    })
    .then((data) => res.json(data))
    .catch(next);
});

export { router };
