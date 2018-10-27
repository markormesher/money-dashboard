import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { AccountSettingsActions, setAccountList, setAccountToEdit, setEditorBusy, setLastUpdate } from "./actions";

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
			const accountId = account.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/settings/accounts/edit/${accountId}`, account)),
			]);
			yield all([
				put(setLastUpdate()),
				put(setEditorBusy(false)),
				put(setAccountToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*loadAccountListSaga() {
	// TODO: skip if accounts haven't been updated since the last call
	yield takeEvery(AccountSettingsActions.START_LOAD_ACCOUNT_LIST, function*() {
		try {
			const accountList: ThinAccount[] = yield call(() => {
				return axios.get("/settings/accounts/list").then((res) => res.data);
			});
			yield put(setAccountList(accountList));
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*accountSettingsSagas() {
	yield all([
		deleteAccountSaga(),
		saveAccountSaga(),
		loadAccountListSaga(),
	]);
}

export {
	accountSettingsSagas,
};
