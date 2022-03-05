import { CurrencyCode } from "./ICurrency";

interface IExchangeRate {
  readonly currencyCode: CurrencyCode;
  readonly date: number;
  readonly ratePerGbp: number;
  readonly updateTime: number;
}

type ExchangeRateMap = {
  [key in CurrencyCode]?: IExchangeRate;
};

export { IExchangeRate, ExchangeRateMap };
