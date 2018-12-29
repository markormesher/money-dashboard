import { RouterState } from "connected-react-router";
import { all } from "redux-saga/effects";
import { accountsReducer, accountsSagas, IAccountsState } from "./accounts";
import { authReducer, authSagas, IAuthState } from "./auth";
import { budgetsReducer, budgetsSagas, IBudgetsState } from "./budgets";
import { categoriesReducer, categoriesSagas, ICategoriesState } from "./categories";
import { dashboardReducer, dashboardSagas, IDashboardState } from "./dashboard";
import { globalReducer, IGlobalState } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { INavState, navReducer } from "./nav";
import { IProfilesState, profilesReducer, profilesSagas } from "./profiles";
import { ITransactionsState, transactionsReducer, transactionsSagas } from "./transactions";

interface IRootState {
	readonly accounts?: IAccountsState;
	readonly auth?: IAuthState;
	readonly budgets?: IBudgetsState;
	readonly categories?: ICategoriesState;
	readonly dashboard?: IDashboardState;
	readonly global?: IGlobalState;
	readonly nav?: INavState;
	readonly profiles?: IProfilesState;
	readonly transactions?: ITransactionsState;

	// from connected-react-router
	readonly router?: RouterState;
}

const rootReducers = {
	[KeyCache.STATE_KEY]: KeyCache.reducer,
	accounts: accountsReducer,
	auth: authReducer,
	budgets: budgetsReducer,
	categories: categoriesReducer,
	dashboard: dashboardReducer,
	global: globalReducer,
	nav: navReducer,
	profiles: profilesReducer,
	transactions: transactionsReducer,
};

function*rootSaga(): Generator {
	yield all([
		accountsSagas(),
		authSagas(),
		budgetsSagas(),
		categoriesSagas(),
		dashboardSagas(),
		profilesSagas(),
		transactionsSagas(),
	]);
}

export {
	IRootState,
	rootReducers,
	rootSaga,
};
