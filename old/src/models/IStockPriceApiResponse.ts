import { StockTicker } from "./IStock";

interface IStockPriceApiResponse {
  readonly status: string;
  readonly from: string;
  readonly symbol: StockTicker;
  readonly open: number;
  readonly high: number;
  readonly low: number;
  readonly close: number;
  readonly volume: number;
  readonly afterHours: number;
  readonly preMarket: number;
}

export { IStockPriceApiResponse };
