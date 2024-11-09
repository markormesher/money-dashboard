import { SelectQueryBuilder } from "typeorm";
import axios from "axios";
import { format, startOfDay, addDays, addHours } from "date-fns";
import { isDev } from "../utils/env";
import { GLOBAL_MIN_DATE } from "../utils/dates";
import { StatusError } from "../utils/StatusError";
import { getFileConfig, getEnvConfig } from "../config/config-loader";
import { DbStockPrice } from "../db/models/DbStockPrice";
import { StockPriceMap, IStockPrice } from "../models/IStockPrice";
import { ALL_STOCK_TICKERS, StockTicker, ALL_STOCKS } from "../models/IStock";
import { IStockPriceApiResponse } from "../models/IStockPriceApiResponse";

const API_BASE = "https://api.polygon.io/v1";
const API_AUTH_QUERY_STRING = `?apiKey=${getFileConfig(getEnvConfig("POLYGON_TOKEN_FILE"))}`;
const DATE_FMT = "yyyy-MM-dd";

function getStockPriceQueryBuilder(): SelectQueryBuilder<DbStockPrice> {
  return DbStockPrice.createQueryBuilder("stock_price");
}

async function getStockPricesBetweenDates(fromDate: number, toDate: number): Promise<Map<number, StockPriceMap>> {
  const prices = await getStockPriceQueryBuilder()
    .where("stock_price.date >= :fromDate")
    .andWhere("stock_price.date <= :toDate")
    .andWhere("stock_price.rate_per_base_currency is not null")
    .setParameters({
      fromDate,
      toDate,
    })
    .getMany();

  const output = new Map<number, StockPriceMap>();
  prices.forEach((price) => {
    output.set(price.date, { ...(output.get(price.date) || {}), [price.ticker]: price });
  });
  return output;
}

async function getLatestStockPrices(): Promise<StockPriceMap> {
  const latestPrices = await Promise.all(
    ALL_STOCK_TICKERS.map((ticker) =>
      getStockPriceQueryBuilder()
        .where("stock_price.ticker = :ticker")
        .andWhere("stock_price.rate_per_base_currency is not null")
        .orderBy("date", "DESC")
        .setParameters({ ticker })
        .limit(1)
        .getOne(),
    ),
  );

  const output: StockPriceMap = {};
  latestPrices.forEach((price) => {
    output[price.ticker] = price;
  });
  return output;
}

async function updateNextMissingStockPrice(): Promise<IStockPrice | void> {
  // the max date we should query is 1.5 days behind UTC to make sure we're okay with timezones for US exchanges
  // i.e. yesterday if it's after midday, otherwise the day before that
  const maxDate = startOfDay(addHours(new Date(), -36));
  const perStockTasks = await Promise.all(
    ALL_STOCKS.map(async (stock) => {
      const datesFilled = (
        await getStockPriceQueryBuilder()
          .where("stock_price.ticker = :ticker")
          .setParameters({ ticker: stock.ticker })
          .getMany()
      ).map((price) => price.date);

      const tasks: [StockTicker, number][] = [];
      for (let date = startOfDay(stock.minDate); date.getTime() <= maxDate.getTime(); date = addDays(date, 1)) {
        const dateInt = date.getTime();
        if (datesFilled.indexOf(dateInt) < 0) {
          tasks.push([stock.ticker, dateInt]);
        }
      }

      return tasks;
    }),
  );

  const allTasks = [].concat(...perStockTasks).sort((a, b) => a[1] - b[1]);

  if (allTasks.length === 0) {
    return;
  }

  const nextTask = allTasks[0];
  return updateStockPrice(nextTask[0], nextTask[1]);
}

async function updateStockPrice(ticker: StockTicker, date: number): Promise<IStockPrice> {
  if (isDev()) {
    return Promise.resolve(null);
  }

  if (date < GLOBAL_MIN_DATE) {
    throw new StatusError(403, "Date is below global minimum");
  }

  const dateStr = format(date, DATE_FMT);
  const url = `${API_BASE}/open-close/${ticker}/${dateStr}${API_AUTH_QUERY_STRING}`;
  let closePrice: number;
  try {
    const apiRes = await axios.get(url).then((res) => res.data as IStockPriceApiResponse);
    closePrice = apiRes.close;
  } catch (e) {
    // note: the API might have actually failed and be hiding data that should be here;
    // to deal with this, null records are occassionally removed to force a re-try
    closePrice = null;
  }
  const repo = DbStockPrice.getRepository();
  const price = repo.merge(new DbStockPrice(), {
    ticker,
    date: startOfDay(date).getTime(),
    ratePerBaseCurrency: closePrice,
  });
  return repo.save(price);
}

async function removeRandomNullStockPrices(qty: number): Promise<void> {
  const recordsToRemove = await getStockPriceQueryBuilder()
    .where("stock_price.rate_per_base_currency IS NULL")
    .orderBy("random()")
    .limit(qty)
    .getMany();

  await DbStockPrice.getRepository().remove(recordsToRemove);
}

export {
  getStockPriceQueryBuilder,
  getStockPricesBetweenDates,
  getLatestStockPrices,
  updateNextMissingStockPrice,
  updateStockPrice,
  removeRandomNullStockPrices,
};
