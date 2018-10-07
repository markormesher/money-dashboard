import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { AccountSettingsActions, setAccountToEdit, setLastUpdate } from "./actions";

function*deleteAccountSaga() {
	yield takeEvery(AccountSettingsActions.START_DELETE_ACCOUNT, function*(action: PayloadAction) {
		try {
			const accountId: string = action.payload.accountId;
			yield call(() => axios.post(`/settings/accounts/delete/${accountId}`));
			yield put(setLastUpdate());
		} catch (err) {
			yield put(setError(err));
		}

	});
}

function*saveAccountSaga() {
	yield takeEvery(AccountSettingsActions.START_SAVE_ACCOUNT, function*(action: PayloadAction) {
		try {
			const account: Partial<ThinAccount> = action.payload.account;
			const accountId = account.id || "new";
			yield call(() => axios.post(`/settings/accounts/edit/${accountId}`, account));
			yield all([
				put(setLastUpdate()),
				put(setAccountToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}

	});
}

function*accountSettingsSagas() {
	yield all([
		deleteAccountSaga(),
		saveAccountSaga(),
	]);
}

export {
	accountSettingsSagas,
};
