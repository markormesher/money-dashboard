import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import { authReducer, IAuthState } from "./auth/reducer";
import { authSagas } from "./auth/sagas";
import { globalReducer, IGlobalState } from "./global/reducer";
import { INavState, navReducer } from "./nav/reducer";
import { accountSettingsReducer, IAccountSettingsState } from "./settings/accounts/reducer";
import { accountSettingsSagas } from "./settings/accounts/sagas";
import { budgetSettingsReducer, IBudgetSettingsState } from "./settings/budgets/reducer";
import { budgetSettingsSagas } from "./settings/budgets/sagas";
import { categorySettingsReducer, ICategorySettingsState } from "./settings/categories/reducer";
import { categorySettingsSagas } from "./settings/categories/sagas";
import { IProfileSettingsState, profileSettingsReducer } from "./settings/profiles/reducer";
import { profileSettingsSagas } from "./settings/profiles/sagas";
import { ITransactionsState, transactionsReducer } from "./transactions/reducer";
import { transactionsSagas } from "./transactions/sagas";

interface IRootState {
	readonly auth?: IAuthState;
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
	auth: authReducer,
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

function*rootSaga() {
	yield all([
		accountSettingsSagas(),
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
