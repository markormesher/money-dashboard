import { CurrencyCode } from "./ICurrency";

type IExchangeRateApiResponse = {
  readonly rates: { [key in CurrencyCode]: number };
  readonly base: CurrencyCode;
  readonly timestamp: number;
};

export { IExchangeRateApiResponse };
