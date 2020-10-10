import { startOfDay, endOfDay } from "date-fns";
import { DbUser } from "../../db/models/DbUser";
import { DateModeOption } from "../../../commons/models/ITransaction";
import { getExchangeRatesBetweenDates } from "../exchange-rate-manager";
import { getTransactionQueryBuilder } from "../transaction-manager";
import { IAssetPerformanceData } from "../../../commons/models/IAssetPerformanceData";

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

  let initialBalanceInclGrowth = 0;
  let initialBalanceExclGrowth = 0;
  const dailyTxnTotalsInclGrowth: Map<number, number> = new Map();
  const dailyTxnTotalsExclGrowth: Map<number, number> = new Map();

  const minTxnDate = startOfDay(
    allTransactions.map((txn) => txn.transactionDate).reduce((a, b) => Math.min(a, b), Infinity),
  ).getTime();
  const maxTxnDate = endOfDay(
    allTransactions.map((txn) => txn.transactionDate).reduce((a, b) => Math.max(a, b), -Infinity),
  ).getTime();

  const exchangeRates = await getExchangeRatesBetweenDates(minTxnDate, maxTxnDate);

  // add up the totals of all transactions per date
  allTransactions.forEach((txn) => {
    const date = dateMode === "effective" ? txn.effectiveDate : txn.transactionDate;
    const txnDate = txn.transactionDate;

    const exchangeRatePerGbp = exchangeRates.has(txnDate)
      ? exchangeRates.get(txnDate)[txn.account.currencyCode].ratePerGbp
      : 1; // TODO: remove conditional when all rates are back filled
    const amount = txn.amount / exchangeRatePerGbp;

    if (date < startDate) {
      initialBalanceInclGrowth += amount;
      initialBalanceExclGrowth += txn.category.isAssetGrowthCategory ? 0 : amount;
    } else {
      dailyTxnTotalsInclGrowth.set(date, (dailyTxnTotalsInclGrowth.get(date) || 0) + amount);
      dailyTxnTotalsExclGrowth.set(
        date,
        (dailyTxnTotalsExclGrowth.get(date) || 0) + (txn.category.isAssetGrowthCategory ? 0 : amount),
      );
    }
  });

  // convert daily txn totals into daily balances
  const dataInclGrowth: Array<{ x: number; y: number }> = [];
  const dataExclGrowth: Array<{ x: number; y: number }> = [];
  dailyTxnTotalsInclGrowth.forEach((total, date) => dataInclGrowth.push({ x: date, y: total }));
  dailyTxnTotalsExclGrowth.forEach((total, date) => dataExclGrowth.push({ x: date, y: total }));
  dataInclGrowth.sort((a, b) => a.x - b.x);
  dataExclGrowth.sort((a, b) => a.x - b.x);
  for (let i = 0; i < dataInclGrowth.length; i++) {
    dataInclGrowth[i].y = dataInclGrowth[i].y + (i === 0 ? initialBalanceInclGrowth : dataInclGrowth[i - 1].y);
  }
  for (let i = 0; i < dataExclGrowth.length; i++) {
    dataExclGrowth[i].y = dataExclGrowth[i].y + (i === 0 ? initialBalanceExclGrowth : dataExclGrowth[i - 1].y);
  }

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
