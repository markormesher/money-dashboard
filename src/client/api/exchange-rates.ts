import axios from "axios";
import { useState } from "react";
import { ExchangeRateMap } from "../../models/IExchangeRate";
import { globalErrorManager } from "../helpers/errors/error-manager";

async function getLatestExchangeRates(): Promise<ExchangeRateMap> {
  const res = await axios.get<ExchangeRateMap>("/api/exchange-rates/latest");
  return res.data;
}

// hooks to access cached values

let cachedLatestExchangeRates: ExchangeRateMap | undefined = undefined;

function useLatestExchangeRates(): [ExchangeRateMap | undefined, () => void] {
  const [accountList, setLatestExchangeRates] = useState<ExchangeRateMap | undefined>(cachedLatestExchangeRates);

  function refreshLatestExchangeRates(): void {
    getLatestExchangeRates()
      .then((accounts) => {
        setLatestExchangeRates(accounts);
        cachedLatestExchangeRates = accounts;
      })
      .catch((err) => {
        globalErrorManager.emitNonFatalError("Failed to reload latest exchange rates", err);
      });
  }

  return [accountList, refreshLatestExchangeRates];
}

const ExchangeRateApi = {
  getLatestExchangeRates,
  useLatestExchangeRates,
};

export { ExchangeRateApi };
