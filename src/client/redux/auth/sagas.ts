import axios from "axios";
import { all, call, put, take } from "redux-saga/effects";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import { addWait, removeWait } from "../global/actions";
import { AuthActions, setCurrentUser, unsetCurrentUser } from "./actions";

function* loadUserSaga() {
	yield take(AuthActions.START_LOAD_CURRENT_USER);
	yield put(addWait("auth"));
	try {
		const user: ThinUser = yield call(() => axios.get("/auth/current-user").then((res) => res.data));
		yield [
			put(setCurrentUser(user)),
			put(removeWait("auth")),
		];
	} catch (err) {
		yield [
			put(unsetCurrentUser()), // TODO: put some kind of error state
			put(removeWait("auth")),
		];
	}
}

function* logOutCurrentUserSaga() {
	yield take(AuthActions.START_LOGOUT_CURRENT_USER);
	yield put(addWait("auth"));
	try {
		yield call(() => axios.post("/auth/logout"));
		yield [
			put(unsetCurrentUser()),
			put(removeWait("auth")),
		];
	} catch (err) {
		yield [
			put(unsetCurrentUser()), // TODO: put some kind of error state
			put(removeWait("auth")),
		];
	}
}

function* authSagas() {
	yield all([
		loadUserSaga(),
		logOutCurrentUserSaga(),
	]);
}

export {
	authSagas,
};
