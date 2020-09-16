import { CurrencyCode } from "./ICurrency";

interface IExchangeRate {
  readonly currencyCode: CurrencyCode;
  readonly date: number;
  readonly ratePerGbp: number;
}

type ExchangeRateMap = {
  [key in CurrencyCode]?: IExchangeRate;
};

type ExchangeRateMultiMap = {
  [key in CurrencyCode]?: IExchangeRate[];
};

export { IExchangeRate, ExchangeRateMap, ExchangeRateMultiMap };
