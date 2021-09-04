import { endOfDay } from "date-fns";
import { DbUser } from "../../db/models/DbUser";
import { DateModeOption, compareTransactionsByDate } from "../../../commons/models/ITransaction";
import { getExchangeRatesBetweenDates } from "../exchange-rate-manager";
import { getTransactionQueryBuilder } from "../transaction-manager";
import { IAssetPerformanceData } from "../../../commons/models/IAssetPerformanceData";
import { CurrencyCode } from "../../../commons/models/ICurrency";

async function getAssetPerformanceReportData(
  user: DbUser,
  startDate: number,
  endDate: number,
  dateMode: DateModeOption,
  accountIds: string[],
  zeroBasis: boolean,
  showAsPercent: boolean,
): Promise<IAssetPerformanceData> {
  const dateField = `${dateMode}Date`;
  const allTransactions = await getTransactionQueryBuilder({ withAccount: true, withCategory: true })
    .where("transaction.profile_id = :profileId")
    .andWhere(`transaction.${dateField} <= :endDate`)
    .andWhere(`transaction.deleted = FALSE`)
    .andWhere(`account.id IN (:...accountIds)`)
    .setParameters({
      profileId: user.activeProfile.id,
      endDate,
      accountIds: [null, ...accountIds], // null fixes issues with empty arrays
    })
    .getMany();

  if (allTransactions.length === 0) {
    return {
      dataInclGrowth: [],
      dataExclGrowth: [],
      totalChangeInclGrowth: 0,
      totalChangeExclGrowth: 0,
      zeroBasis,
      showAsPercent,
    };
  }

  const dailyBalancePerCurrencyInclGrowth: Map<number, Map<CurrencyCode, number>> = new Map();
  const dailyBalancePerCurrencyExclGrowth: Map<number, Map<CurrencyCode, number>> = new Map();
  const runningTotalPerCurrencyInclGrowth: Map<CurrencyCode, number> = new Map();
  const runningTotalPerCurrencyExclGrowth: Map<CurrencyCode, number> = new Map();
  let lastDateSeen = startDate;

  const takeRunningTotalSnapshot = (): void => {
    dailyBalancePerCurrencyInclGrowth.set(lastDateSeen, new Map(runningTotalPerCurrencyInclGrowth));
    dailyBalancePerCurrencyExclGrowth.set(lastDateSeen, new Map(runningTotalPerCurrencyExclGrowth));
  };

  // compute the balance per date, keeping different currencies separate
  allTransactions
    .sort((a, b) => compareTransactionsByDate(a, b, dateMode))
    .forEach((txn) => {
      const date = Math.max(startDate, dateMode === "effective" ? txn.effectiveDate : txn.transactionDate);
      const amount = txn.amount;
      const currencyCode = txn.account.currencyCode;

      if (date != lastDateSeen) {
        takeRunningTotalSnapshot();
      }

      runningTotalPerCurrencyInclGrowth.set(
        currencyCode,
        (runningTotalPerCurrencyInclGrowth.get(currencyCode) || 0) + amount,
      );
      if (!txn.category.isAssetGrowthCategory) {
        runningTotalPerCurrencyExclGrowth.set(
          currencyCode,
          (runningTotalPerCurrencyExclGrowth.get(currencyCode) || 0) + amount,
        );
      }
      lastDateSeen = date;
    });

  // get the exchange rate for every day in the transaction range
  const maxTxnDate = endOfDay(
    allTransactions.map((txn) => txn.transactionDate).reduce((a, b) => Math.max(a, b), -Infinity),
  ).getTime();
  const exchangeRates = await getExchangeRatesBetweenDates(startDate, maxTxnDate);

  // convert per-currency balances into the GBP value on that day
  const dataInclGrowth: Array<{ x: number; y: number }> = [];
  const dataExclGrowth: Array<{ x: number; y: number }> = [];
  dailyBalancePerCurrencyInclGrowth.forEach((totals, date) => {
    let total = 0;
    totals.forEach((balance, currencyCode) => {
      total += balance / exchangeRates.get(date)[currencyCode].ratePerGbp;
    });
    dataInclGrowth.push({ x: date, y: total });
  });
  dailyBalancePerCurrencyExclGrowth.forEach((totals, date) => {
    let total = 0;
    totals.forEach((balance, currencyCode) => {
      total += balance / exchangeRates.get(date)[currencyCode].ratePerGbp;
    });
    dataExclGrowth.push({ x: date, y: total });
  });

  // calculate total movement values
  const totalChangeInclGrowth = dataInclGrowth[dataInclGrowth.length - 1].y - dataInclGrowth[0].y;
  const totalChangeExclGrowth = dataExclGrowth[dataExclGrowth.length - 1].y - dataExclGrowth[0].y;

  // apply adjustments for zero basis and/or % output
  if (zeroBasis) {
    for (let i = 0; i < dataInclGrowth.length; ++i) {
      const valueInclGrowth = dataInclGrowth[i].y;
      const valueExclGrowth = dataExclGrowth[i].y;

      if (showAsPercent) {
        dataInclGrowth[i].y = valueExclGrowth === 0 ? 0 : (valueInclGrowth - valueExclGrowth) / valueExclGrowth;
      } else {
        dataInclGrowth[i].y = valueInclGrowth - valueExclGrowth;
      }
      dataExclGrowth[i].y = 0;
    }
  }

  return {
    dataInclGrowth,
    dataExclGrowth,
    totalChangeInclGrowth,
    totalChangeExclGrowth,
    zeroBasis,
    showAsPercent,
  };
}

export { getAssetPerformanceReportData };
