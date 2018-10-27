import axios from "axios";
import { all, call, put, select, takeEvery } from "redux-saga/effects";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { IRootState } from "../../root";
import { AccountSettingsActions, setAccountList, setAccountToEdit, setEditorBusy, setLastUpdate } from "./actions";

const lastUpdateSelector = (state: IRootState) => state.settings.accounts.lastUpdate;
const lastLoadSelector = (state: IRootState) => state.settings.accounts.accountListLastLoaded;

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
	yield takeEvery(AccountSettingsActions.START_LOAD_ACCOUNT_LIST, function*() {
		const lastUpdate = yield select(lastUpdateSelector);
		const lastLoad = yield select(lastLoadSelector);
		if (lastLoad >= lastUpdate) {
			return;
		}
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
