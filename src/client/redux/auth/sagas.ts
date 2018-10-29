import axios from "axios";
import { all, call, put, take, takeEvery } from "redux-saga/effects";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import { addWait, removeWait, setError } from "../global/actions";
import { AuthActions, setCurrentUser, unsetCurrentUser } from "./actions";

function*loadUserSaga(): Generator {
	yield takeEvery(AuthActions.START_LOAD_CURRENT_USER, function*(): Generator {
		yield put(addWait("auth"));
		try {
			const user: ThinUser = yield call(() => axios.get("/auth/current-user").then((res) => res.data));
			if (user !== undefined) {
				yield all([
					put(setCurrentUser(user)),
					put(removeWait("auth")),
				]);
			} else {
				yield all([
					put(unsetCurrentUser()),
					put(removeWait("auth")),
				]);
			}
		} catch (err) {
			yield all([
				put(setError(err)),
				put(removeWait("auth")),
			]);
		}
	});
}

function*logOutCurrentUserSaga(): Generator {
	yield take(AuthActions.START_LOGOUT_CURRENT_USER);
	yield put(addWait("auth"));
	try {
		yield call(() => axios.post("/auth/logout"));
		yield all([
			put(unsetCurrentUser()),
			put(removeWait("auth")),
		]);
	} catch (err) {
		yield all([
			put(setError(err)),
			put(removeWait("auth")),
		]);
	}
}

function*authSagas(): Generator {
	yield all([
		loadUserSaga(),
		logOutCurrentUserSaga(),
	]);
}

export {
	authSagas,
};
