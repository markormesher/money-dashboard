import { SelectQueryBuilder } from "typeorm";
import axios, { AxiosRequestConfig } from "axios";
import { format, startOfDay, addDays, parseISO, getHours, getMinutes } from "date-fns";
import { DbExchangeRate } from "../db/models/DbExchangeRate";
import { ExchangeRateMap, IExchangeRate } from "../models/IExchangeRate";
import { ALL_CURRENCY_CODES, DEFAULT_CURRENCY_CODE, ALL_CURRENCIES } from "../models/ICurrency";
import { IExchangeRateApiResponse } from "../models/IExchangeRateApiResponse";
import { isDev } from "../utils/env";
import { GLOBAL_MIN_DATE } from "../utils/dates";
import { StatusError } from "../utils/StatusError";
import { getFileConfig, getEnvConfig } from "../config/config-loader";
import { logger } from "../utils/logging";

const API_BASE = "https://openexchangerates.org/api";
const API_QUERY_STRING = `?symbols=${ALL_CURRENCY_CODES.join(",")}`;
const AXIOS_OPTS: AxiosRequestConfig = {
  headers: {
    Accept: "application/json",
    Authorization: `Token ${getFileConfig(getEnvConfig("OPEN_EXCHANGE_RATES_TOKEN_FILE"))}`,
  },
};

function getExchangeRateQueryBuilder(): SelectQueryBuilder<DbExchangeRate> {
  return DbExchangeRate.createQueryBuilder("exchange_rate");
}

async function getExchangeRatesBetweenDates(fromDate: number, toDate: number): Promise<Map<number, ExchangeRateMap>> {
  const rates = await getExchangeRateQueryBuilder()
    .where("exchange_rate.date >= :fromDate")
    .andWhere("exchange_rate.date <= :toDate")
    .setParameters({
      fromDate,
      toDate,
    })
    .getMany();

  const output = new Map<number, ExchangeRateMap>();
  rates.forEach((rate) => {
    output.set(rate.date, { ...(output.get(rate.date) || {}), [rate.currencyCode]: rate });
  });
  return output;
}

async function getLatestExchangeRates(): Promise<ExchangeRateMap> {
  const latestRates = await Promise.all(
    ALL_CURRENCY_CODES.map((code) =>
      getExchangeRateQueryBuilder()
        .where("exchange_rate.currency_code = :code")
        .orderBy("date", "DESC")
        .setParameters({ code })
        .limit(1)
        .getOne(),
    ),
  );

  const output: ExchangeRateMap = {};
  latestRates.forEach((rate) => {
    output[rate.currencyCode] = rate;
  });
  return output;
}

async function updateNextMissingExchangeRates(): Promise<IExchangeRate[] | void> {
  // issues an update if a given date is missing for any currency
  const yesterday = addDays(startOfDay(new Date()), -1);
  const perCurrencyTasks = await Promise.all(
    ALL_CURRENCIES.map(async (currency) => {
      const datesFilled = (
        await getExchangeRateQueryBuilder()
          .where("exchange_rate.currency_code = :code")
          .setParameters({ code: currency.code })
          .getMany()
      )
        .filter((price) => !(getHours(price.date) == 23 && getMinutes(price.date) == 59)) // filter to non-end-of-day updates
        .map((price) => price.date);

      const tasks: number[] = [];
      for (let date = startOfDay(GLOBAL_MIN_DATE); date.getTime() <= yesterday.getTime(); date = addDays(date, 1)) {
        const dateInt = date.getTime();
        if (datesFilled.indexOf(dateInt) < 0) {
          tasks.push(dateInt);
        }
      }

      return tasks;
    }),
  );

  const allTasks = []
    .concat(...perCurrencyTasks)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort();

  logger.info("Tasks", { allTasks });

  if (allTasks.length === 0) {
    return;
  }

  const nextTask = allTasks[0];
  return updateExchangeRates(format(nextTask, "yyyy-MM-dd"));
}

async function updateLatestExchangeRates(): Promise<void> {
  await updateExchangeRates("latest");
}

async function updateExchangeRates(date: string): Promise<IExchangeRate[]> {
  if (isDev()) {
    return Promise.resolve([]);
  }

  if (date !== "latest" && parseISO(date).getTime() < GLOBAL_MIN_DATE) {
    throw new StatusError(403, "Date is below global minimum");
  }

  let url: string;
  if (date === "latest") {
    url = `${API_BASE}/latest.json${API_QUERY_STRING}`;
  } else {
    url = `${API_BASE}/historical/${date}.json${API_QUERY_STRING}`;
  }

  const apiRes = await axios.get(url, AXIOS_OPTS).then((res) => res.data as IExchangeRateApiResponse);

  const conversionToDefault = 1 / apiRes.rates[DEFAULT_CURRENCY_CODE];
  const rates: DbExchangeRate[] = [];
  const repo = DbExchangeRate.getRepository();
  for (const code of ALL_CURRENCY_CODES) {
    rates.push(
      repo.merge(new DbExchangeRate(), {
        currencyCode: code,
        ratePerGbp: code === DEFAULT_CURRENCY_CODE ? 1 : apiRes.rates[code] * conversionToDefault,
        date: startOfDay(apiRes.timestamp * 1000).getTime(),
        updateTime: apiRes.timestamp * 1000,
      }),
    );
  }

  return repo.save(rates);
}

export {
  getExchangeRateQueryBuilder,
  getExchangeRatesBetweenDates,
  getLatestExchangeRates,
  updateNextMissingExchangeRates,
  updateLatestExchangeRates,
  updateExchangeRates,
};
