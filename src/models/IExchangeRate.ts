import { CurrencyCode } from "./ICurrency";

type IExchangeRate = {
  readonly currencyCode: CurrencyCode;
  readonly date: number;
  readonly ratePerGbp: number;
  readonly updateTime: number;
};

type ExchangeRateMap = {
  [key in CurrencyCode]?: IExchangeRate;
};

export { IExchangeRate, ExchangeRateMap };
