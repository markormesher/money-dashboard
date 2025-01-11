import axios from "axios";
import { StockPriceMap } from "../../models/IStockPrice";
import { cacheWrap } from "./utils";

async function getLatestStockPrices(): Promise<StockPriceMap> {
  const res = await axios.get<StockPriceMap>("/api/stock-prices/latest");
  return res.data;
}

const StockPriceApi = {
  getLatestStockPrices,
  useLatestStockPrices: cacheWrap("latest-stock-prices", getLatestStockPrices),
};

export { StockPriceApi };
