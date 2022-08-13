import { RouterState } from "connected-react-router";
import { all } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { accountsReducer, accountsSagas, IAccountsState } from "./accounts";
import { authReducer, authSagas, IAuthState } from "./auth";
import { budgetsReducer, budgetsSagas, IBudgetsState } from "./budgets";
import { categoriesReducer, categoriesSagas, ICategoriesState } from "./categories";
import { dashboardReducer, dashboardSagas, IDashboardState } from "./dashboard";
import { globalReducer, IGlobalState } from "./global";
import { INavState, navReducer } from "./nav";
import { IProfilesState, profilesReducer, profilesSagas } from "./profiles";
import { ITransactionsState, transactionsReducer, transactionsSagas } from "./transactions";
import { IExchangeRateState, exchangeRatesReducer, exchangeRatesSagas } from "./exchange-rates";
import { IStockPriceState, stockPricesReducer, stockPricesSagas } from "./stock-prices";

interface IRootState {
  readonly accounts?: IAccountsState;
  readonly auth?: IAuthState;
  readonly budgets?: IBudgetsState;
  readonly categories?: ICategoriesState;
  readonly dashboard?: IDashboardState;
  readonly exchangeRates?: IExchangeRateState;
  readonly global?: IGlobalState;
  readonly nav?: INavState;
  readonly profiles?: IProfilesState;
  readonly stockPrices?: IStockPriceState;
  readonly transactions?: ITransactionsState;

  // from connected-react-router
  readonly router?: RouterState;
}

const rootReducers = {
  [CacheKeyUtil.STATE_KEY]: CacheKeyUtil.reducer,
  accounts: accountsReducer,
  auth: authReducer,
  budgets: budgetsReducer,
  categories: categoriesReducer,
  dashboard: dashboardReducer,
  exchangeRates: exchangeRatesReducer,
  global: globalReducer,
  nav: navReducer,
  profiles: profilesReducer,
  stockPrices: stockPricesReducer,
  transactions: transactionsReducer,
};

function* rootSaga(): Generator {
  yield all([
    accountsSagas(),
    authSagas(),
    budgetsSagas(),
    categoriesSagas(),
    dashboardSagas(),
    exchangeRatesSagas(),
    profilesSagas(),
    stockPricesSagas(),
    transactionsSagas(),
  ]);
}

export { IRootState, rootReducers, rootSaga };
