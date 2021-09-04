import { endOfDay } from "date-fns";
import { IBalanceHistoryData } from "../../../commons/models/IBalanceHistoryData";
import { DbUser } from "../../db/models/DbUser";
import { DateModeOption, ITransaction } from "../../../commons/models/ITransaction";
import { getExchangeRatesBetweenDates } from "../exchange-rate-manager";
import { getTransactionQueryBuilder } from "../transaction-manager";
import { CurrencyCode } from "../../../commons/models/ICurrency";

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
    .andWhere(`transaction.${dateField} <= :endDate`)
    .setParameters({
      profileId: user.activeProfile.id,
      endDate,
    })
    .getMany();

  if (allTransactions.length === 0) {
    return {
      balanceDataPoints: [],
      minTotal: 0,
      maxTotal: 0,
      minDate: 0,
      maxDate: 0,
      changeAbsolute: 0,
    };
  }

  const dailyBalancePerCurrency: Map<number, Map<CurrencyCode, number>> = new Map();
  const runningTotalPerCurrency: Map<CurrencyCode, number> = new Map();
  let lastDateSeen = startDate;

  const takeRunningTotalSnapshot = (): void => {
    dailyBalancePerCurrency.set(lastDateSeen, new Map(runningTotalPerCurrency));
  };

  // compute the balance per date, keeping different currencies separate
  allTransactions
    .sort((a, b) => compareTransactions(a, b, dateMode))
    .forEach((txn) => {
      const date = Math.max(startDate, dateMode === "effective" ? txn.effectiveDate : txn.transactionDate);
      const amount = txn.amount;
      const currencyCode = txn.account.currencyCode;

      if (date != lastDateSeen) {
        takeRunningTotalSnapshot();
      }

      runningTotalPerCurrency.set(currencyCode, (runningTotalPerCurrency.get(currencyCode) || 0) + amount);
      lastDateSeen = date;
    });

  takeRunningTotalSnapshot();

  console.log(dailyBalancePerCurrency);

  // get the exchange rate for every day in the transaction range
  const maxTxnDate = endOfDay(
    allTransactions.map((txn) => txn.transactionDate).reduce((a, b) => Math.max(a, b), -Infinity),
  ).getTime();
  const exchangeRates = await getExchangeRatesBetweenDates(startDate, maxTxnDate);

  // convert per-currency balances into the GBP value on that day
  const balanceDataPoints: Array<{ x: number; y: number }> = [];
  dailyBalancePerCurrency.forEach((totals, date) => {
    let total = 0;
    totals.forEach((balance, currencyCode) => {
      total += balance / exchangeRates.get(date)[currencyCode].ratePerGbp;
    });
    balanceDataPoints.push({ x: date, y: total });
  });

  // track minimum and maximum balances
  let minTotal, maxTotal, minDate, maxDate;
  for (let i = 0; i < balanceDataPoints.length; i++) {
    const balance = balanceDataPoints[i].y;

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

function compareTransactions(a: ITransaction, b: ITransaction, dateMode: DateModeOption): number {
  if (dateMode === "effective") {
    return a.effectiveDate - b.effectiveDate;
  } else {
    return a.transactionDate - b.transactionDate;
  }
}

export { getBalanceHistoryReportData };
