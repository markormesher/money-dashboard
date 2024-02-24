import { RouterState } from "connected-react-router";
import { all } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { accountsReducer, accountsSagas, IAccountsState } from "./accounts";
import { dashboardReducer, dashboardSagas, IDashboardState } from "./dashboard";
import { IExchangeRateState, exchangeRatesReducer, exchangeRatesSagas } from "./exchange-rates";
import { IStockPriceState, stockPricesReducer, stockPricesSagas } from "./stock-prices";

interface IRootState {
  readonly accounts?: IAccountsState;
  readonly dashboard?: IDashboardState;
  readonly exchangeRates?: IExchangeRateState;
  readonly stockPrices?: IStockPriceState;

  // from connected-react-router
  readonly router?: RouterState;
}

const rootReducers = {
  [CacheKeyUtil.STATE_KEY]: CacheKeyUtil.reducer,
  accounts: accountsReducer,
  dashboard: dashboardReducer,
  exchangeRates: exchangeRatesReducer,
  stockPrices: stockPricesReducer,
};

function* rootSaga(): Generator {
  yield all([accountsSagas(), dashboardSagas(), exchangeRatesSagas(), stockPricesSagas()]);
}

export { IRootState, rootReducers, rootSaga };
