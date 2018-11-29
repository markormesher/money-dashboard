import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import { accountSettingsReducer, accountSettingsSagas, IAccountSettingsState } from "./accounts";
import { authReducer, authSagas, IAuthState } from "./auth";
import { budgetSettingsReducer, budgetSettingsSagas, IBudgetSettingsState } from "./budgets";
import { categorySettingsReducer, categorySettingsSagas, ICategorySettingsState } from "./categories";
import { dashboardReducer, dashboardSagas, IDashboardState } from "./dashboard";
import { globalReducer, IGlobalState } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { INavState, navReducer } from "./nav";
import { IProfileSettingsState, profileSettingsReducer, profileSettingsSagas } from "./profiles";
import { ITransactionsState, transactionsReducer, transactionsSagas } from "./transactions";

interface IRootState {
	readonly auth?: IAuthState;
	readonly dashboard?: IDashboardState;
	readonly global?: IGlobalState;
	readonly nav?: INavState;
	readonly router?: { // from connected-react-router
		readonly location?: {
			readonly pathname?: string;
		};
	};
	readonly settings?: {
		readonly accounts?: IAccountSettingsState;
		readonly budgets?: IBudgetSettingsState;
		readonly categories?: ICategorySettingsState;
		readonly profiles?: IProfileSettingsState;
	};
	readonly transactions?: ITransactionsState;
}

const rootReducer = combineReducers({
	[KeyCache.STATE_KEY]: KeyCache.reducer,
	auth: authReducer,
	dashboard: dashboardReducer,
	global: globalReducer,
	nav: navReducer,
	settings: combineReducers({
		accounts: accountSettingsReducer,
		budgets: budgetSettingsReducer,
		categories: categorySettingsReducer,
		profiles: profileSettingsReducer,
	}),
	transactions: transactionsReducer,
});

function*rootSaga(): Generator {
	yield all([
		accountSettingsSagas(),
		dashboardSagas(),
		authSagas(),
		budgetSettingsSagas(),
		categorySettingsSagas(),
		profileSettingsSagas(),
		transactionsSagas(),
	]);
}

export {
	IRootState,
	rootReducer,
	rootSaga,
};
