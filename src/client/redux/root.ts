import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import { authReducer, IAuthState } from "./auth/reducer";
import { authSagas } from "./auth/sagas";
import { globalReducer, IGlobalState } from "./global/reducer";
import { INavState, navReducer } from "./nav/reducer";

interface IRootState {
	auth?: IAuthState;
	global?: IGlobalState;
	nav?: INavState;

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
});

function* rootSaga() {
	yield all([
		authSagas(),
	]);
}

export {
	IRootState,
	rootReducer,
	rootSaga,
};
