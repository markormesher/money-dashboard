import { RouterState } from "connected-react-router";
import { all } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { accountsReducer, accountsSagas, IAccountsState } from "./accounts";
import { categoriesReducer, categoriesSagas, ICategoriesState } from "./categories";
import { dashboardReducer, dashboardSagas, IDashboardState } from "./dashboard";
import { envelopesReducer, envelopesSagas, IEnvelopesState } from "./envelopes";
import { globalReducer, IGlobalState } from "./global";
import { INavState, navReducer } from "./nav";
import { ITransactionsState, transactionsReducer, transactionsSagas } from "./transactions";
import { IExchangeRateState, exchangeRatesReducer, exchangeRatesSagas } from "./exchange-rates";
import { IStockPriceState, stockPricesReducer, stockPricesSagas } from "./stock-prices";

interface IRootState {
  readonly accounts?: IAccountsState;
  readonly categories?: ICategoriesState;
  readonly dashboard?: IDashboardState;
  readonly envelopes?: IEnvelopesState;
  readonly exchangeRates?: IExchangeRateState;
  readonly global?: IGlobalState;
  readonly nav?: INavState;
  readonly stockPrices?: IStockPriceState;
  readonly transactions?: ITransactionsState;

  // from connected-react-router
  readonly router?: RouterState;
}

const rootReducers = {
  [CacheKeyUtil.STATE_KEY]: CacheKeyUtil.reducer,
  accounts: accountsReducer,
  categories: categoriesReducer,
  dashboard: dashboardReducer,
  envelopes: envelopesReducer,
  exchangeRates: exchangeRatesReducer,
  global: globalReducer,
  nav: navReducer,
  stockPrices: stockPricesReducer,
  transactions: transactionsReducer,
};

function* rootSaga(): Generator {
  yield all([
    accountsSagas(),
    categoriesSagas(),
    dashboardSagas(),
    envelopesSagas(),
    exchangeRatesSagas(),
    stockPricesSagas(),
    transactionsSagas(),
  ]);
}

export { IRootState, rootReducers, rootSaga };
