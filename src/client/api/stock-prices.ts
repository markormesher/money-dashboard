import axios from "axios";
import { useState } from "react";
import { StockPriceMap } from "../../models/IStockPrice";
import { globalErrorManager } from "../helpers/errors/error-manager";

async function getLatestStockPrices(): Promise<StockPriceMap> {
  const res = await axios.get<StockPriceMap>("/api/stock-prices/latest");
  return res.data;
}

// hooks to access cached values

let cachedLatestStockPrices: StockPriceMap | undefined = undefined;

function useLatestStockPrices(): [StockPriceMap | undefined, () => void] {
  const [accountList, setLatestStockPrices] = useState<StockPriceMap | undefined>(cachedLatestStockPrices);

  function refreshLatestStockPrices(): void {
    getLatestStockPrices()
      .then((accounts) => {
        setLatestStockPrices(accounts);
        cachedLatestStockPrices = accounts;
      })
      .catch((err) => {
        globalErrorManager.emitNonFatalError("Failed to reload latest stock prices", err);
      });
  }

  return [accountList, refreshLatestStockPrices];
}

const StockPriceApi = {
  getLatestStockPrices,
  useLatestStockPrices,
};

export { StockPriceApi };
