type CurrencyCode = "GBP" | "EUR" | "USD";

interface ICurrency {
  readonly code: CurrencyCode;
  readonly name: string;
  readonly htmlSymbol: string;
}

const gbp: ICurrency = {
  code: "GBP",
  name: "British Pounds",
  htmlSymbol: "&pound;",
};

const eur: ICurrency = {
  code: "EUR",
  name: "Euros",
  htmlSymbol: "&euro;",
};

const usd: ICurrency = {
  code: "USD",
  name: "US Dollars",
  htmlSymbol: "$",
};

const DEFAULT_CURRENCY = gbp;
const DEFAULT_CURRENCY_CODE = DEFAULT_CURRENCY.code;
const ALL_CURRENCIES = [gbp, eur, usd];
const ALL_CURRENCY_CODES = ALL_CURRENCIES.map((c) => c.code);

function getCurrency(currencyCode: CurrencyCode): ICurrency {
  return ALL_CURRENCIES.find((c) => c.code == currencyCode);
}

export {
  CurrencyCode,
  ICurrency,
  DEFAULT_CURRENCY,
  DEFAULT_CURRENCY_CODE,
  ALL_CURRENCIES,
  ALL_CURRENCY_CODES,
  getCurrency,
};