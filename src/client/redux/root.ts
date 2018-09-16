import { combineReducers } from "redux";
import { all } from "redux-saga/effects";
import { authReducer, IAuthState } from "./auth/reducer";
import { authSagas } from "./auth/sagas";
import { globalReducer, IGlobalState } from "./global/reducer";

interface IRootState {
	auth?: IAuthState;
	global?: IGlobalState;
}

const rootReducer = combineReducers({
	auth: authReducer,
	global: globalReducer,
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
