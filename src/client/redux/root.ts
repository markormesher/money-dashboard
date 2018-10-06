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

interface IRootState {
	auth?: IAuthState;
	global?: IGlobalState;
	nav?: INavState;
	settings?: {
		accounts?: IAccountSettingsState;
		budgets?: IBudgetSettingsState;
		categories?: ICategorySettingsState;
	};

	// from connected-react-router
	router?: {
		location?: {
			pathname?: string;
		};
	};
}

const rootReducer = combineReducers({
	auth: authReducer,
	global: globalReducer,
	nav: navReducer,
	settings: combineReducers({
		accounts: accountSettingsReducer,
		budgets: budgetSettingsReducer,
		categories: categorySettingsReducer,
	}),
});

function*rootSaga() {
	yield all([
		authSagas(),
		accountSettingsSagas(),
		budgetSettingsSagas(),
		categorySettingsSagas(),
	]);
}

export {
	IRootState,
	rootReducer,
	rootSaga,
};
