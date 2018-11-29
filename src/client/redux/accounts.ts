import axios from "axios";
import { ActionCreator } from "redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinAccount } from "../../server/model-thins/ThinAccount";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";

interface IAccountsState {
	readonly displayActiveOnly: boolean;
	readonly accountToEdit: ThinAccount;
	readonly editorBusy: boolean;
	readonly accountList: ThinAccount[];
}

const initialState: IAccountsState = {
	displayActiveOnly: true,
	accountToEdit: undefined,
	editorBusy: false,
	accountList: undefined,
};

enum AccountActions {
	START_DELETE_ACCOUNT = "AccountActions.START_DELETE_ACCOUNT",
	START_SAVE_ACCOUNT = "AccountActions.START_SAVE_ACCOUNT",
	START_LOAD_ACCOUNT_LIST = "AccountActions.START_LOAD_ACCOUNT_LIST",
	SET_DISPLAY_ACTIVE_ONLY = "AccountActions.SET_DISPLAY_ACTIVE_ONLY",
	SET_ACCOUNT_TO_EDIT = "AccountActions.SET_ACCOUNT_TO_EDIT",
	SET_EDITOR_BUSY = "AccountActions.SET_EDITOR_BUSY",
	SET_ACCOUNT_LIST = "AccountActions.SET_ACCOUNT_LIST",
}

const startDeleteAccount: ActionCreator<PayloadAction> = (accountId: string) => ({
	type: AccountActions.START_DELETE_ACCOUNT,
	payload: { accountId },
});

const startSaveAccount: ActionCreator<PayloadAction> = (account: Partial<ThinAccount>) => ({
	type: AccountActions.START_SAVE_ACCOUNT,
	payload: { account },
});

const startLoadAccountList: ActionCreator<PayloadAction> = () => ({
	type: AccountActions.START_LOAD_ACCOUNT_LIST,
});

const setDisplayActiveOnly: ActionCreator<PayloadAction> = (activeOnly: boolean) => ({
	type: AccountActions.SET_DISPLAY_ACTIVE_ONLY,
	payload: { activeOnly },
});

const setAccountToEdit: ActionCreator<PayloadAction> = (account: ThinAccount) => ({
	type: AccountActions.SET_ACCOUNT_TO_EDIT,
	payload: { account },
});

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => ({
	type: AccountActions.SET_EDITOR_BUSY,
	payload: { editorBusy },
});

const setAccountList: ActionCreator<PayloadAction> = (accountList: ThinAccount[]) => ({
	type: AccountActions.SET_ACCOUNT_LIST,
	payload: {
		accountList,
		accountListLoadedAt: new Date().getTime(),
	},
});

function*deleteAccountSaga(): Generator {
	yield takeEvery(AccountActions.START_DELETE_ACCOUNT, function*(action: PayloadAction): Generator {
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
	yield takeEvery(AccountActions.START_SAVE_ACCOUNT, function*(action: PayloadAction): Generator {
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
	yield takeEvery(AccountActions.START_LOAD_ACCOUNT_LIST, function*(): Generator {
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

function*accountsSagas(): Generator {
	yield all([
		deleteAccountSaga(),
		saveAccountSaga(),
		loadAccountListSaga(),
	]);
}

function accountsReducer(state = initialState, action: PayloadAction): IAccountsState {
	switch (action.type) {
		case AccountActions.SET_DISPLAY_ACTIVE_ONLY:
			return {
				...state,
				displayActiveOnly: action.payload.activeOnly,
			};

		case AccountActions.SET_ACCOUNT_TO_EDIT:
			return {
				...state,
				accountToEdit: action.payload.account,
			};

		case AccountActions.SET_EDITOR_BUSY:
			return {
				...state,
				editorBusy: action.payload.editorBusy,
			};

		case AccountActions.SET_ACCOUNT_LIST:
			return {
				...state,
				accountList: action.payload.accountList,
			};

		default:
			return state;
	}
}

export {
	IAccountsState,
	accountsReducer,
	accountsSagas,
	startDeleteAccount,
	startSaveAccount,
	startLoadAccountList,
	setDisplayActiveOnly,
	setAccountToEdit,
	setEditorBusy,
	setAccountList,
};
