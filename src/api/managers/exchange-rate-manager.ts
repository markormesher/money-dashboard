import { SelectQueryBuilder } from "typeorm";
import { DbExchangeRate } from "../db/models/DbExchangeRate";
import { ExchangeRateMultiMap, ExchangeRateMap } from "../../commons/models/IExchangeRate";
import { ALL_CURRENCY_CODES } from "../../commons/models/ICurrency";

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

function updateHistoricalExchangeRages(days: number): Promise<void> {
  return Promise.resolve();
}

function updateLiveExchangeRate(): Promise<void> {
  return Promise.resolve();
}

export {
  getExchangeRateQueryBuilder,
  getExchangeRatesBetweenDates,
  getLatestExchangeRates,
  updateHistoricalExchangeRages,
  updateLiveExchangeRate,
};
