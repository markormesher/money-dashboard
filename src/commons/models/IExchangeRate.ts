import { CurrencyCode } from "./ICurrency";

interface IExchangeRate {
  readonly currencyCode: CurrencyCode;
  readonly date: number;
  readonly ratePerGbp: number;
}

export { IExchangeRate };
