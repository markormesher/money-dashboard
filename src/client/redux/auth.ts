import axios from "axios";
import { ActionCreator } from "redux";
import { all, call, put, take, takeEvery } from "redux-saga/effects";
import { ThinUser } from "../../server/model-thins/ThinUser";
import { addWait, removeWait, setError } from "./global";
import { PayloadAction } from "./helpers/PayloadAction";

interface IAuthState {
	readonly activeUser?: ThinUser;
	readonly activeProfile?: number;
}

const initialState: IAuthState = {
	activeUser: undefined,
};

enum AuthActions {
	START_LOAD_CURRENT_USER = "AuthActions.START_LOAD_CURRENT_USER",
	START_LOGOUT_CURRENT_USER = "AuthActions.START_LOGOUT_CURRENT_USER",
	SET_CURRENT_USER = "AuthActions.SET_CURRENT_USER",
	UNSET_CURRENT_USER = "AuthActions.UNSET_CURRENT_USER",
}

const startLoadCurrentUser: ActionCreator<PayloadAction> = () => ({
	type: AuthActions.START_LOAD_CURRENT_USER,
});

const startLogOutCurrentUser: ActionCreator<PayloadAction> = () => ({
	type: AuthActions.START_LOGOUT_CURRENT_USER,
});

const setCurrentUser: ActionCreator<PayloadAction> = (user: ThinUser) => ({
	type: AuthActions.SET_CURRENT_USER,
	payload: { user },
});

const unsetCurrentUser: ActionCreator<PayloadAction> = () => ({
	type: AuthActions.UNSET_CURRENT_USER,
});

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

function authReducer(state = initialState, action: PayloadAction): IAuthState {
	switch (action.type) {
		case AuthActions.SET_CURRENT_USER:
			return {
				...state,
				activeUser: action.payload.user,
			};

		case AuthActions.UNSET_CURRENT_USER:
			return {
				...state,
				activeUser: undefined,
			};

		default:
			return state;
	}
}

export {
	IAuthState,
	authReducer,
	authSagas,
	startLoadCurrentUser,
	startLogOutCurrentUser,
	setCurrentUser,
	unsetCurrentUser,
};
