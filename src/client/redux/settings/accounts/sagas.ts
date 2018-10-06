import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { AccountSettingsActions, setLastUpdate } from "./actions";

function*deleteAccountSaga() {
	yield takeEvery(AccountSettingsActions.START_DELETE_ACCOUNT, function*(action: PayloadAction) {
		try {
			yield call(() => axios.post(`/settings/accounts/delete/${action.payload.accountId}`));
			yield put(setLastUpdate());
		} catch (err) {
			yield put(setError(err));
		}

	});
}

function*accountSettingsSagas() {
	yield all([
		deleteAccountSaga(),
	]);
}

export {
	accountSettingsSagas,
};
