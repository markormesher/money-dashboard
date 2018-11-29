import axios from "axios";
import { ActionCreator } from "redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinAccount } from "../../server/model-thins/ThinAccount";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";

interface IAccountSettingsState {
	readonly displayActiveOnly: boolean;
	readonly accountToEdit: ThinAccount;
	readonly editorBusy: boolean;
	readonly accountList: ThinAccount[];
}

const initialState: IAccountSettingsState = {
	displayActiveOnly: true,
	accountToEdit: undefined,
	editorBusy: false,
	accountList: undefined,
};

enum AccountSettingsActions {
	START_DELETE_ACCOUNT = "AccountSettingsActions.START_DELETE_ACCOUNT",
	START_SAVE_ACCOUNT = "AccountSettingsActions.START_SAVE_ACCOUNT",
	START_LOAD_ACCOUNT_LIST = "AccountSettingsActions.START_LOAD_ACCOUNT_LIST",
	SET_DISPLAY_ACTIVE_ONLY = "AccountSettingsActions.SET_DISPLAY_ACTIVE_ONLY",
	SET_ACCOUNT_TO_EDIT = "AccountSettingsActions.SET_ACCOUNT_TO_EDIT",
	SET_EDITOR_BUSY = "AccountSettingsActions.SET_EDITOR_BUSY",
	SET_ACCOUNT_LIST = "AccountSettingsActions.SET_ACCOUNT_LIST",
}

const startDeleteAccount: ActionCreator<PayloadAction> = (accountId: string) => ({
	type: AccountSettingsActions.START_DELETE_ACCOUNT,
	payload: { accountId },
});

const startSaveAccount: ActionCreator<PayloadAction> = (account: Partial<ThinAccount>) => ({
	type: AccountSettingsActions.START_SAVE_ACCOUNT,
	payload: { account },
});

const startLoadAccountList: ActionCreator<PayloadAction> = () => ({
	type: AccountSettingsActions.START_LOAD_ACCOUNT_LIST,
});

const setDisplayActiveOnly: ActionCreator<PayloadAction> = (activeOnly: boolean) => ({
	type: AccountSettingsActions.SET_DISPLAY_ACTIVE_ONLY,
	payload: { activeOnly },
});

const setAccountToEdit: ActionCreator<PayloadAction> = (account: ThinAccount) => ({
	type: AccountSettingsActions.SET_ACCOUNT_TO_EDIT,
	payload: { account },
});

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => ({
	type: AccountSettingsActions.SET_EDITOR_BUSY,
	payload: { editorBusy },
});

const setAccountList: ActionCreator<PayloadAction> = (accountList: ThinAccount[]) => ({
	type: AccountSettingsActions.SET_ACCOUNT_LIST,
	payload: {
		accountList,
		accountListLoadedAt: new Date().getTime(),
	},
});

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

function accountSettingsReducer(state = initialState, action: PayloadAction): IAccountSettingsState {
	switch (action.type) {
		case AccountSettingsActions.SET_DISPLAY_ACTIVE_ONLY:
			return {
				...state,
				displayActiveOnly: action.payload.activeOnly,
			};

		case AccountSettingsActions.SET_ACCOUNT_TO_EDIT:
			return {
				...state,
				accountToEdit: action.payload.account,
			};

		case AccountSettingsActions.SET_EDITOR_BUSY:
			return {
				...state,
				editorBusy: action.payload.editorBusy,
			};

		case AccountSettingsActions.SET_ACCOUNT_LIST:
			return {
				...state,
				accountList: action.payload.accountList,
			};

		default:
			return state;
	}
}

export {
	IAccountSettingsState,
	accountSettingsReducer,
	accountSettingsSagas,
	startDeleteAccount,
	startSaveAccount,
	startLoadAccountList,
	setDisplayActiveOnly,
	setAccountToEdit,
	setEditorBusy,
	setAccountList,
};
