import { StockTicker } from "./IStock";

type IStockPrice = {
  readonly ticker: StockTicker;
  readonly date: number;
  readonly ratePerBaseCurrency: number;
};

type StockPriceMap = {
  [key in StockTicker]?: IStockPrice;
};

export { IStockPrice, StockPriceMap };
