import { SelectQueryBuilder } from "typeorm";
import axios, { AxiosRequestConfig } from "axios";
import { format, startOfDay, addDays } from "date-fns";
import { DbExchangeRate } from "../db/models/DbExchangeRate";
import { ExchangeRateMultiMap, ExchangeRateMap, IExchangeRate } from "../../commons/models/IExchangeRate";
import { ALL_CURRENCY_CODES, DEFAULT_CURRENCY_CODE } from "../../commons/models/ICurrency";
import { IExchangeRateApiResponse } from "../../commons/models/IExchangeRateApiResponse";
import { getSecret } from "../config/config-loader";

const API_BASE = "https://openexchangerates.org/api";
const API_QUERY_STRING = `?symbols=${ALL_CURRENCY_CODES.join(",")}`;
const AXIOS_OPTS: AxiosRequestConfig = {
  headers: {
    Accept: "application/json",
    Authorization: `Token ${getSecret("open-exchange-rates.key")}`,
  },
};

interface ICategoryQueryBuilderOptions {
  readonly withProfile?: boolean;
}

function getExchangeRateQueryBuilder(): SelectQueryBuilder<DbExchangeRate> {
  return DbExchangeRate.createQueryBuilder("exchange_rate");
}

function getExchangeRatesBetweenDates(fromDate: number, toDate: number): Promise<ExchangeRateMultiMap> {
  return getExchangeRateQueryBuilder()
    .where("exchange_rate.date >= :fromDate")
    .andWhere("exchange_rate.date <= :fromDate")
    .setParameters({
      fromDate,
      toDate,
    })
    .getMany()
    .then((rates) => {
      const output: ExchangeRateMultiMap = {};
      ALL_CURRENCY_CODES.forEach((code) => (output[code] = []));
      rates.forEach((rate) => output[rate.currencyCode].push(rate));
      return output;
    });
}

function getLatestExchangeRates(): Promise<ExchangeRateMap> {
  return Promise.resolve({});
}

function updateHistoricalExchangeRages(days = 2): Promise<IExchangeRate[]> {
  const dateStrings = [];
  const today = new Date();
  for (let i = 1; i <= days; ++i) {
    dateStrings.push(format(startOfDay(addDays(today, -i)), "yyyy-MM-dd"));
  }
  return Promise.all(dateStrings.map((str) => updateExchangeRates(str))).then(() => null);
}

function updateLatestExchangeRates(): Promise<IExchangeRate[]> {
  return updateExchangeRates("latest");
}

function updateExchangeRates(date: string): Promise<IExchangeRate[]> {
  let url: string;
  if (date === "latest") {
    url = `${API_BASE}/latest.json${API_QUERY_STRING}`;
  } else {
    url = `${API_BASE}/historical/${date}.json${API_QUERY_STRING}`;
  }

  return axios
    .get(url, AXIOS_OPTS)
    .then((res) => res.data as IExchangeRateApiResponse)
    .then((res) => {
      const conversionToDefault = 1 / res.rates[DEFAULT_CURRENCY_CODE];
      const rates: Partial<DbExchangeRate>[] = [];
      for (const code of ALL_CURRENCY_CODES) {
        rates.push({
          currencyCode: code,
          ratePerGbp: code === DEFAULT_CURRENCY_CODE ? 1 : res.rates[code] * conversionToDefault,
          date: startOfDay(res.timestamp * 1000).getTime(),
        });
      }
      return rates;
    })
    .then((rates) => {
      const repo = DbExchangeRate.getRepository();
      const dbRates = rates.map((rate) => repo.merge(new DbExchangeRate(), rate));
      return repo.save(dbRates);
    });
}

export {
  getExchangeRateQueryBuilder,
  getExchangeRatesBetweenDates,
  getLatestExchangeRates,
  updateHistoricalExchangeRages,
  updateLatestExchangeRates,
};
