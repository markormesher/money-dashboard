import { SelectQueryBuilder } from "typeorm";
import axios from "axios";
import { format, startOfDay, addDays } from "date-fns";
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

  const output: Map<number, StockPriceMap> = new Map();
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
  const yesterday = addDays(startOfDay(new Date()), -1);
  const perStockTasks = await Promise.all(
    ALL_STOCKS.map(async (stock) => {
      const datesFilled = (
        await getStockPriceQueryBuilder()
          .where("stock_price.ticker = :ticker")
          .setParameters({ ticker: stock.ticker })
          .getMany()
      ).map((price) => price.date);

      const tasks: [StockTicker, number][] = [];
      for (let date = startOfDay(stock.minDate); date.getTime() <= yesterday.getTime(); date = addDays(date, 1)) {
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
    // TODO: what if the API fails but there really was some data here?
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

export {
  getStockPriceQueryBuilder,
  getStockPricesBetweenDates,
  getLatestStockPrices,
  updateNextMissingStockPrice,
  updateStockPrice,
};
