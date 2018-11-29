import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import { KeyCache } from "../../caching/KeyCache";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { AccountSettingsActions, setAccountList, setAccountToEdit, setEditorBusy } from "./actions";

function*deleteAccountSaga(): Generator {
	yield takeEvery(AccountSettingsActions.START_DELETE_ACCOUNT, function*(action: PayloadAction): Generator {
		try {
			const accountId: string = action.payload.accountId;
			yield call(() => axios.post(`/settings/accounts/delete/${accountId}`));
			yield put(KeyCache.touchKey("accounts"));
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*saveAccountSaga(): Generator {
	yield takeEvery(AccountSettingsActions.START_SAVE_ACCOUNT, function*(action: PayloadAction): Generator {
		try {
			const account: Partial<ThinAccount> = action.payload.account;
			const accountId = account.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/settings/accounts/edit/${accountId}`, account)),
			]);
			yield all([
				put(KeyCache.touchKey("accounts")),
				put(setEditorBusy(false)),
				put(setAccountToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*loadAccountListSaga(): Generator {
	yield takeEvery(AccountSettingsActions.START_LOAD_ACCOUNT_LIST, function*(): Generator {
		if (KeyCache.keyIsValid("account-list", ["accounts"])) {
			return;
		}
		try {
			const accountList: ThinAccount[] = yield call(() => {
				return axios.get("/settings/accounts/list").then((res) => res.data);
			});
			yield all([
				put(setAccountList(accountList)),
				put(KeyCache.touchKey("account-list")),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*accountSettingsSagas(): Generator {
	yield all([
		deleteAccountSaga(),
		saveAccountSaga(),
		loadAccountListSaga(),
	]);
}

export {
	accountSettingsSagas,
};
