import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import { authReducer, IAuthState } from "./auth/reducer";
import { authSagas } from "./auth/sagas";
import { globalReducer, IGlobalState } from "./global/reducer";
import { INavState, navReducer } from "./nav/reducer";
import { accountSettingsReducer, IAccountSettingsState } from "./settings/accounts/reducer";
import { accountSettingsSagas } from "./settings/accounts/sagas";

interface IRootState {
	auth?: IAuthState;
	global?: IGlobalState;
	nav?: INavState;
	settings?: {
		accounts?: IAccountSettingsState;
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
	}),
});

function* rootSaga() {
	yield all([
		accountSettingsSagas(),
		authSagas(),
	]);
}

export {
	IRootState,
	rootReducer,
	rootSaga,
};
