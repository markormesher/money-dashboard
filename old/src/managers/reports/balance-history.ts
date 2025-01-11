import { addDays, startOfDay } from "date-fns";
import { IBalanceHistoryData } from "../../models/IBalanceHistoryData";
import { DbUser } from "../../db/models/DbUser";
import { DateModeOption } from "../../models/ITransaction";
import { getExchangeRatesBetweenDates } from "../exchange-rate-manager";
import { getTransactionQueryBuilder } from "../transaction-manager";
import { CurrencyCode } from "../../models/ICurrency";
import { getStockPricesBetweenDates } from "../stock-price-manager";
import { StockTicker, getStock } from "../../models/IStock";
import { ExchangeRateMap } from "../../models/IExchangeRate";
import { StockPriceMap } from "../../models/IStockPrice";

async function getBalanceHistoryReportData(
  user: DbUser,
  startDate: number,
  endDate: number,
  dateMode: DateModeOption,
): Promise<IBalanceHistoryData> {
  const dateField = `${dateMode}Date` as "effectiveDate" | "transactionDate";
  const transactions = await getTransactionQueryBuilder({ withAccount: true })
    .where("transaction.profile_id = :profileId")
    .andWhere(`transaction.${dateField} <= :endDate`)
    .andWhere("transaction.deleted = FALSE")
    .orderBy(`transaction.${dateField}`, "ASC")
    .setParameters({
      profileId: user.activeProfile.id,
      endDate,
    })
    .getMany();

  if (transactions.length === 0) {
    return {
      balanceDataPoints: [],
      minTotal: 0,
      maxTotal: 0,
      minTotalDate: 0,
      maxTotalDate: 0,
      changeAbsolute: 0,
    };
  }

  const minDate = startOfDay(transactions[0][dateField]).getTime();

  // for every day between the min and max dates:
  // - advance the exchange rate and stock price pointers to get the latest non-null rates
  // - advance the transaction pointer to visit all transactions in that day
  //   - update the running total for each currency and stock
  // - commit a snapshot of the GBP equivalent of all running totals

  // add a 7-day buffer to start of these ranges, just in case the first day has no values
  const exchangeRates: [number, ExchangeRateMap][] = [
    ...(await getExchangeRatesBetweenDates(addDays(minDate, -7).getTime(), endDate)).entries(),
  ].sort((a, b) => a[0] - b[0]);
  const stockPrices: [number, StockPriceMap][] = [
    ...(await getStockPricesBetweenDates(addDays(minDate, -7).getTime(), endDate)),
  ].sort((a, b) => a[0] - b[0]);

  const runningTotalPerCurrency: Map<CurrencyCode, number> = new Map();
  const runningTotalPerStock: Map<StockTicker, number> = new Map();

  let exchangeRateIdx = -1;
  let stockPriceIdx = -1;
  let transactionIdx = -1;

  const balanceDataPoints: Array<{ x: number; y: number }> = [];

  for (
    let date = startOfDay(Math.max(startDate, minDate)).getTime();
    date <= startOfDay(endDate).getTime();
    date = addDays(date, 1).getTime()
  ) {
    const nextDay = addDays(date, 1).getTime();

    // find the most up to date exchange rates and stock prices
    while (exchangeRateIdx < exchangeRates.length - 1 && exchangeRates[exchangeRateIdx + 1][0] < nextDay) {
      ++exchangeRateIdx;
    }
    while (stockPriceIdx < stockPrices.length - 1 && stockPrices[stockPriceIdx + 1][0] < nextDay) {
      ++stockPriceIdx;
    }

    // visit all transactions up to this date
    while (transactionIdx < transactions.length - 1 && transactions[transactionIdx + 1][dateField] < nextDay) {
      ++transactionIdx;
      const transaction = transactions[transactionIdx];
      const currencyCode = transaction.account.currencyCode;
      const stockTicker = transaction.account.stockTicker;
      const amount = transaction.amount;

      if (stockTicker !== null) {
        runningTotalPerStock.set(stockTicker, (runningTotalPerStock.get(stockTicker) || 0) + amount);
      } else {
        runningTotalPerCurrency.set(currencyCode, (runningTotalPerCurrency.get(currencyCode) || 0) + amount);
      }
    }

    // snapshot the running balances with the latest exchange rates/stock prices for this date
    let gbpTotal = 0;
    for (const [currencyCode, runningTotal] of runningTotalPerCurrency.entries()) {
      const exchangeRate = exchangeRates[exchangeRateIdx][1][currencyCode];
      gbpTotal += runningTotal / exchangeRate.ratePerGbp;
    }
    for (const [stockTicker, runningTotal] of runningTotalPerStock.entries()) {
      const stock = getStock(stockTicker);
      const stockPrice = stockPrices[stockPriceIdx][1][stockTicker];
      const exchangeRate = exchangeRates[exchangeRateIdx][1][stock.baseCurrency];
      gbpTotal += (runningTotal * stockPrice.ratePerBaseCurrency) / exchangeRate.ratePerGbp;
    }
    balanceDataPoints.push({ x: date, y: gbpTotal });
  }

  // work out minimum and maximum balances
  let minTotal, maxTotal, minTotalDate, maxTotalDate;
  for (let i = 0; i < balanceDataPoints.length; i++) {
    const balance = balanceDataPoints[i].y;

    if (!minTotal || minTotal > balance) {
      minTotal = balance;
      minTotalDate = balanceDataPoints[i].x;
    }

    if (!maxTotal || maxTotal < balance) {
      maxTotal = balance;
      maxTotalDate = balanceDataPoints[i].x;
    }
  }

  return {
    balanceDataPoints,
    minTotal,
    maxTotal,
    minTotalDate,
    maxTotalDate,
    changeAbsolute: balanceDataPoints[balanceDataPoints.length - 1].y - balanceDataPoints[0].y,
  };
}

export { getBalanceHistoryReportData };
