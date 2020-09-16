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

function getExchangeRateQueryBuilder(): SelectQueryBuilder<DbExchangeRate> {
  return DbExchangeRate.createQueryBuilder("exchange_rate");
}

async function getExchangeRatesBetweenDates(fromDate: number, toDate: number): Promise<ExchangeRateMultiMap> {
  const rates = await getExchangeRateQueryBuilder()
    .where("exchange_rate.date >= :fromDate")
    .andWhere("exchange_rate.date <= :toDate")
    .setParameters({
      fromDate,
      toDate,
    })
    .getMany();

  const output: ExchangeRateMultiMap = {};
  ALL_CURRENCY_CODES.forEach((code) => (output[code] = []));
  rates.forEach((rate) => output[rate.currencyCode].push(rate));
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

async function updateHistoricalExchangeRages(days = 2): Promise<void> {
  const dateStrings = [];
  const today = new Date();
  for (let i = 1; i <= days; ++i) {
    dateStrings.push(format(startOfDay(addDays(today, -i)), "yyyy-MM-dd"));
  }
  await Promise.all(dateStrings.map((str) => updateExchangeRates(str)));
}

async function updateLatestExchangeRates(): Promise<void> {
  await updateExchangeRates("latest");
}

async function updateExchangeRates(date: string): Promise<IExchangeRate[]> {
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
  updateHistoricalExchangeRages,
  updateLatestExchangeRates,
};
