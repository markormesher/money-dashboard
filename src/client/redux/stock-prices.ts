import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { StockPriceMap } from "../../models/IStockPrice";
import { globalErrorManager } from "../helpers/errors/error-manager";
import { PayloadAction } from "./helpers/PayloadAction";

interface IStockPriceState {
  readonly latestStockPrices: StockPriceMap;
}

const initialState: IStockPriceState = {
  latestStockPrices: undefined,
};

enum StockPriceActions {
  START_LOAD_LATEST_STOCK_PRICES = "StockPriceActions.START_LOAD_LATEST_STOCK_PRICES",

  SET_LATEST_STOCK_PRICES = "StockPriceActions.SET_LATEST_STOCK_PRICES",
}

enum StockPriceCacheKeys {
  LATEST_PRICES = "StockPriceCacheKeys.LATEST_PRICES",
}

// direct call to library method is deliberately not tested
/* istanbul ignore next */
function latestRatesAreCached(): boolean {
  return CacheKeyUtil.keyIsValid(StockPriceCacheKeys.LATEST_PRICES);
}

function startLoadLatestStockPrices(): PayloadAction {
  return {
    type: StockPriceActions.START_LOAD_LATEST_STOCK_PRICES,
  };
}

function setLatestStockPrices(latestStockPrices: StockPriceMap): PayloadAction {
  return {
    type: StockPriceActions.SET_LATEST_STOCK_PRICES,
    payload: { latestStockPrices },
  };
}

function* loadLatestStockPricesSaga(): Generator {
  yield takeEvery(StockPriceActions.START_LOAD_LATEST_STOCK_PRICES, function* (): Generator {
    if (latestRatesAreCached()) {
      return;
    }
    try {
      const latestStockPrices: StockPriceMap = yield call(() => {
        return axios.get("/api/stock-prices/latest").then((res) => res.data as StockPriceMap);
      });
      yield all([
        put(setLatestStockPrices(latestStockPrices)),
        put(CacheKeyUtil.updateKey(StockPriceCacheKeys.LATEST_PRICES)),
      ]);
    } catch (err) {
      globalErrorManager.emitFatalError(err);
    }
  });
}

function* stockPricesSagas(): Generator {
  yield all([loadLatestStockPricesSaga()]);
}

function stockPricesReducer(state = initialState, action: PayloadAction): IStockPriceState {
  switch (action.type) {
    case StockPriceActions.SET_LATEST_STOCK_PRICES:
      return {
        ...state,
        latestStockPrices: action.payload.latestStockPrices,
      };

    default:
      return state;
  }
}

export {
  IStockPriceState,
  StockPriceActions,
  StockPriceCacheKeys,
  stockPricesReducer,
  stockPricesSagas,
  startLoadLatestStockPrices,
  setLatestStockPrices,
};
