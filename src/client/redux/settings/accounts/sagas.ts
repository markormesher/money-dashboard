import axios from "axios";
import { all, call, put, take } from "redux-saga/effects";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import { setError } from "../../global/actions";
import { AccountSettingsActions, setAccountList } from "./actions";

function* loadAccountListSaga() {
	yield take(AccountSettingsActions.START_LOAD_ACCOUNT_LIST);
	// yield put(addWait("auth"));
	try {
		const accounts: ThinAccount[] = yield call(() => axios.get("/settings/accounts").then((res) => res.data));
		yield [
			put(setAccountList(accounts)),
			// put(removeWait("auth")),
		];
	} catch (err) {
		yield [
			put(setError(err)),
			// put(removeWait("auth")),
		];
	}
}

function* accountSettingsSagas() {
	yield all([
		loadAccountListSaga(),
	]);
}

export {
	accountSettingsSagas,
};
