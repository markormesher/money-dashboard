import axios from "axios";
import { ExchangeRateMap } from "../../models/IExchangeRate";
import { cacheWrap } from "./utils";

async function getLatestExchangeRates(): Promise<ExchangeRateMap> {
  const res = await axios.get<ExchangeRateMap>("/api/exchange-rates/latest");
  return res.data;
}

const ExchangeRateApi = {
  getLatestExchangeRates,
  useLatestExchangeRates: cacheWrap("latest-exchange-rates", getLatestExchangeRates),
};

export { ExchangeRateApi };
