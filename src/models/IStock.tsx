import { CurrencyCode } from "./ICurrency";

type StockTicker = "PLTR";

interface IStock {
  readonly ticker: StockTicker;
  readonly baseCurrency: CurrencyCode;
  readonly name: string;
  readonly minDate: number;
}

const pltr: IStock = {
  ticker: "PLTR",
  baseCurrency: "USD",
  name: "PLTR",
  minDate: Date.UTC(2020, 8, 30), // 30th Sep 2020 - DPO date
};

const ALL_STOCKS = [pltr];
const ALL_STOCK_TICKERS = ALL_STOCKS.map((s) => s.ticker);

function getStock(ticker: StockTicker): IStock {
  const stock = ALL_STOCKS.find((s) => s.ticker == ticker);
  if (!stock) {
    throw new Error(`No stock found for the ticker ${ticker}`);
  }
  return stock;
}

export { StockTicker, IStock, ALL_STOCKS, ALL_STOCK_TICKERS, getStock };
