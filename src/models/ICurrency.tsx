import * as React from "react";
import { ReactElement } from "react";

type CurrencyCode = "GBP" | "EUR" | "USD";

type ICurrency = {
  readonly code: CurrencyCode;
  readonly name: string;
  readonly stringSymbol: string;
  readonly htmlSymbol: ReactElement;
};

const gbp: ICurrency = {
  code: "GBP",
  name: "British Pounds",
  stringSymbol: "£",
  htmlSymbol: <>&pound;</>,
};

const eur: ICurrency = {
  code: "EUR",
  name: "Euros",
  stringSymbol: "€",
  htmlSymbol: <>&euro;</>,
};

const usd: ICurrency = {
  code: "USD",
  name: "US Dollars",
  stringSymbol: "$",
  htmlSymbol: <>$</>,
};

const DEFAULT_CURRENCY = gbp;
const DEFAULT_CURRENCY_CODE = DEFAULT_CURRENCY.code;
const ALL_CURRENCIES = [gbp, eur, usd];
const ALL_CURRENCY_CODES = ALL_CURRENCIES.map((c) => c.code);

function getCurrency(currencyCode: CurrencyCode): ICurrency {
  const currency = ALL_CURRENCIES.find((c) => c.code == currencyCode);
  if (!currency) {
    throw new Error(`No currency found for the code ${currencyCode}`);
  }
  return currency;
}

function isCurrencyCode(code: string): code is CurrencyCode {
  return ALL_CURRENCY_CODES.some((c) => c == code);
}

export {
  CurrencyCode,
  ICurrency,
  DEFAULT_CURRENCY,
  DEFAULT_CURRENCY_CODE,
  ALL_CURRENCIES,
  ALL_CURRENCY_CODES,
  getCurrency,
  isCurrencyCode,
};
