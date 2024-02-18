import { RouterState } from "connected-react-router";
import { all } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { accountsReducer, accountsSagas, IAccountsState } from "./accounts";
import { categoriesReducer, categoriesSagas, ICategoriesState } from "./categories";
import { dashboardReducer, dashboardSagas, IDashboardState } from "./dashboard";
import { globalReducer, IGlobalState } from "./global";
import { IExchangeRateState, exchangeRatesReducer, exchangeRatesSagas } from "./exchange-rates";
import { IStockPriceState, stockPricesReducer, stockPricesSagas } from "./stock-prices";

interface IRootState {
  readonly accounts?: IAccountsState;
  readonly categories?: ICategoriesState;
  readonly dashboard?: IDashboardState;
  readonly exchangeRates?: IExchangeRateState;
  readonly global?: IGlobalState;
  readonly stockPrices?: IStockPriceState;

  // from connected-react-router
  readonly router?: RouterState;
}

const rootReducers = {
  [CacheKeyUtil.STATE_KEY]: CacheKeyUtil.reducer,
  accounts: accountsReducer,
  categories: categoriesReducer,
  dashboard: dashboardReducer,
  exchangeRates: exchangeRatesReducer,
  global: globalReducer,
  stockPrices: stockPricesReducer,
};

function* rootSaga(): Generator {
  yield all([accountsSagas(), categoriesSagas(), dashboardSagas(), exchangeRatesSagas(), stockPricesSagas()]);
}

export { IRootState, rootReducers, rootSaga };
