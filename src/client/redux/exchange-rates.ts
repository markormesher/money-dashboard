import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { ExchangeRateMap } from "../../models/IExchangeRate";
import { setError } from "./global";
import { PayloadAction } from "./helpers/PayloadAction";

interface IExchangeRateState {
  readonly latestExchangeRates: ExchangeRateMap;
}

const initialState: IExchangeRateState = {
  latestExchangeRates: undefined,
};

enum ExchangeRateActions {
  START_LOAD_LATEST_EXCHANGE_RATES = "ExchangeRateActions.START_LOAD_LATEST_EXCHANGE_RATES",

  SET_LATEST_EXCHANGE_RATES = "ExchangeRateActions.SET_LATEST_EXCHANGE_RATES",
}

enum ExchangeRateCacheKeys {
  LATEST_RATES = "ExchangeRateCacheKeys.LATEST_RATES",
}

// direct call to library method is deliberately not tested
/* istanbul ignore next */
function latestRatesAreCached(): boolean {
  return CacheKeyUtil.keyIsValid(ExchangeRateCacheKeys.LATEST_RATES);
}

function startLoadLatestExchangeRates(): PayloadAction {
  return {
    type: ExchangeRateActions.START_LOAD_LATEST_EXCHANGE_RATES,
  };
}

function setLatestExchangeRates(latestExchangeRates: ExchangeRateMap): PayloadAction {
  return {
    type: ExchangeRateActions.SET_LATEST_EXCHANGE_RATES,
    payload: { latestExchangeRates },
  };
}

function* loadLatestExchangeRatesSaga(): Generator {
  yield takeEvery(ExchangeRateActions.START_LOAD_LATEST_EXCHANGE_RATES, function*(): Generator {
    if (latestRatesAreCached()) {
      return;
    }
    try {
      const latestExchangeRates: ExchangeRateMap = yield call(() => {
        return axios.get("/api/exchange-rates/latest").then((res) => res.data as ExchangeRateMap);
      });
      yield all([
        put(setLatestExchangeRates(latestExchangeRates)),
        put(CacheKeyUtil.updateKey(ExchangeRateCacheKeys.LATEST_RATES)),
      ]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* exchangeRatesSagas(): Generator {
  yield all([loadLatestExchangeRatesSaga()]);
}

function exchangeRatesReducer(state = initialState, action: PayloadAction): IExchangeRateState {
  switch (action.type) {
    case ExchangeRateActions.SET_LATEST_EXCHANGE_RATES:
      return {
        ...state,
        latestExchangeRates: action.payload.latestExchangeRates,
      };

    default:
      return state;
  }
}

export {
  IExchangeRateState,
  ExchangeRateActions,
  ExchangeRateCacheKeys,
  exchangeRatesReducer,
  exchangeRatesSagas,
  startLoadLatestExchangeRates,
  setLatestExchangeRates,
};
