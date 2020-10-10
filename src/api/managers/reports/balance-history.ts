import { startOfDay, endOfDay } from "date-fns";
import { IBalanceHistoryData } from "../../../commons/models/IBalanceHistoryData";
import { DbUser } from "../../db/models/DbUser";
import { DateModeOption } from "../../../commons/models/ITransaction";
import { getExchangeRatesBetweenDates } from "../exchange-rate-manager";
import { getTransactionQueryBuilder } from "../transaction-manager";

async function getBalanceHistoryReportData(
  user: DbUser,
  startDate: number,
  endDate: number,
  dateMode: DateModeOption,
): Promise<IBalanceHistoryData> {
  const dateField = `${dateMode}Date`;
  const allTransactions = await getTransactionQueryBuilder({ withAccount: true })
    .where("transaction.profile_id = :profileId")
    .andWhere("transaction.deleted = FALSE")
    .andWhere(`transaction.${dateField} < :endDate`)
    .setParameters({
      profileId: user.activeProfile.id,
      endDate,
    })
    .getMany();

  let initialBalance = 0;
  const dailyTxnTotals: Map<number, number> = new Map();

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
      initialBalance += amount;
    } else {
      dailyTxnTotals.set(date, (dailyTxnTotals.get(date) || 0) + amount);
    }
  });

  // convert daily txn totals into daily balances (and track min/max while we're at it)
  let minTotal, maxTotal, minDate, maxDate;
  const balanceDataPoints: Array<{ x: number; y: number }> = [];
  dailyTxnTotals.forEach((total, date) => balanceDataPoints.push({ x: date, y: total }));
  balanceDataPoints.sort((a, b) => a.x - b.x);
  for (let i = 0; i < balanceDataPoints.length; i++) {
    const balance = balanceDataPoints[i].y + (i === 0 ? initialBalance : balanceDataPoints[i - 1].y);
    balanceDataPoints[i].y = balance;

    if (!minTotal || minTotal > balance) {
      minTotal = balance;
      minDate = balanceDataPoints[i].x;
    }

    if (!maxTotal || maxTotal < balance) {
      maxTotal = balance;
      maxDate = balanceDataPoints[i].x;
    }
  }

  return {
    balanceDataPoints,
    minTotal,
    maxTotal,
    minDate,
    maxDate,
    changeAbsolute: balanceDataPoints[balanceDataPoints.length - 1].y - balanceDataPoints[0].y,
  };
}

export { getBalanceHistoryReportData };
