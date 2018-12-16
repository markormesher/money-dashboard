import axios from "axios";
import { ActionCreator } from "redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { IAccount, mapAccountFromApi } from "../../server/models/IAccount";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";
import { ProfileCacheKeys } from "./profiles";

interface IAccountsState {
	readonly displayActiveOnly: boolean;
	readonly accountToEdit: IAccount;
	readonly editorBusy: boolean;
	readonly accountList: IAccount[];
	readonly accountEditsInProgress: IAccount[];
}

const initialState: IAccountsState = {
	displayActiveOnly: true,
	accountToEdit: undefined,
	editorBusy: false,
	accountList: undefined,
	accountEditsInProgress: [],
};

enum AccountActions {
	START_DELETE_ACCOUNT = "AccountActions.START_DELETE_ACCOUNT",
	START_SAVE_ACCOUNT = "AccountActions.START_SAVE_ACCOUNT",
	START_SET_ACCOUNT_ACTIVE = "AccountActions.START_SET_ACCOUNT_ACTIVE",
	START_LOAD_ACCOUNT_LIST = "AccountActions.START_LOAD_ACCOUNT_LIST",
	SET_DISPLAY_ACTIVE_ONLY = "AccountActions.SET_DISPLAY_ACTIVE_ONLY",
	SET_ACCOUNT_TO_EDIT = "AccountActions.SET_ACCOUNT_TO_EDIT",
	SET_EDITOR_BUSY = "AccountActions.SET_EDITOR_BUSY",
	SET_ACCOUNT_LIST = "AccountActions.SET_ACCOUNT_LIST",
	ADD_ACCOUNT_EDIT_IN_PROGRESS = "AccountActions.ADD_ACCOUNT_EDIT_IN_PROGRESS",
	REMOVE_ACCOUNT_EDIT_IN_PROGRESS = "AccountActions.REMOVE_ACCOUNT_EDIT_IN_PROGRESS",
}

enum AccountCacheKeys {
	ACCOUNT_DATA = "AccountCacheKeys.ACCOUNT_DATA",
	ACCOUNT_LIST = "AccountCacheKeys.ACCOUNT_LIST",
}

const startDeleteAccount: ActionCreator<PayloadAction> = (accountId: string) => ({
	type: AccountActions.START_DELETE_ACCOUNT,
	payload: { accountId },
});

const startSaveAccount: ActionCreator<PayloadAction> = (account: Partial<IAccount>) => ({
	type: AccountActions.START_SAVE_ACCOUNT,
	payload: { account },
});

const startSetAccountActive: ActionCreator<PayloadAction> = (account: IAccount, active: boolean) => ({
	type: AccountActions.START_SET_ACCOUNT_ACTIVE,
	payload: { account, active },
});

const startLoadAccountList: ActionCreator<PayloadAction> = () => ({
	type: AccountActions.START_LOAD_ACCOUNT_LIST,
});

const setDisplayActiveOnly: ActionCreator<PayloadAction> = (activeOnly: boolean) => ({
	type: AccountActions.SET_DISPLAY_ACTIVE_ONLY,
	payload: { activeOnly },
});

const setAccountToEdit: ActionCreator<PayloadAction> = (account: IAccount) => ({
	type: AccountActions.SET_ACCOUNT_TO_EDIT,
	payload: { account },
});

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => ({
	type: AccountActions.SET_EDITOR_BUSY,
	payload: { editorBusy },
});

const setAccountList: ActionCreator<PayloadAction> = (accountList: IAccount[]) => ({
	type: AccountActions.SET_ACCOUNT_LIST,
	payload: { accountList },
});

const addAccountEditInProgress: ActionCreator<PayloadAction> = (account: IAccount) => ({
	type: AccountActions.ADD_ACCOUNT_EDIT_IN_PROGRESS,
	payload: { account },
});

const removeAccountEditInProgress: ActionCreator<PayloadAction> = (account: IAccount) => ({
	type: AccountActions.REMOVE_ACCOUNT_EDIT_IN_PROGRESS,
	payload: { account },
});

function*deleteAccountSaga(): Generator {
	yield takeEvery(AccountActions.START_DELETE_ACCOUNT, function*(action: PayloadAction): Generator {
		try {
			const accountId: string = action.payload.accountId;
			yield call(() => axios.post(`/accounts/delete/${accountId}`));
			yield put(KeyCache.touchKey(AccountCacheKeys.ACCOUNT_DATA));
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*saveAccountSaga(): Generator {
	yield takeEvery(AccountActions.START_SAVE_ACCOUNT, function*(action: PayloadAction): Generator {
		try {
			const account: Partial<IAccount> = action.payload.account;
			const accountId = account.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/accounts/edit/${accountId}`, account)),
			]);
			yield all([
				put(KeyCache.touchKey(AccountCacheKeys.ACCOUNT_DATA)),
				put(setEditorBusy(false)),
				put(setAccountToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*setAccountActiveSaga(): Generator {
	yield takeEvery(AccountActions.START_SET_ACCOUNT_ACTIVE, function*(action: PayloadAction): Generator {
		try {
			const account: IAccount = action.payload.account;
			const active: boolean = action.payload.active;
			const apiRoute = active ? "set-active" : "set-inactive";
			yield all([
				put(addAccountEditInProgress(account)),
				call(() => axios.post(`/accounts/${apiRoute}/${account.id}`)),
			]);
			yield all([
				put(KeyCache.touchKey(AccountCacheKeys.ACCOUNT_DATA)),
				put(removeAccountEditInProgress(account)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*loadAccountListSaga(): Generator {
	yield takeEvery(AccountActions.START_LOAD_ACCOUNT_LIST, function*(): Generator {
		if (KeyCache.keyIsValid(AccountCacheKeys.ACCOUNT_LIST, [
			AccountCacheKeys.ACCOUNT_DATA,
			ProfileCacheKeys.CURRENT_PROFILE,
		])) {
			return;
		}
		try {
			const accountList: IAccount[] = yield call(() => {
				return axios.get("/accounts/list")
						.then((res) => {
							const raw: IAccount[] = res.data;
							return raw.map(mapAccountFromApi);
						});
			});
			yield all([
				put(setAccountList(accountList)),
				put(KeyCache.touchKey(AccountCacheKeys.ACCOUNT_LIST)),
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
		setAccountActiveSaga(),
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

		case AccountActions.ADD_ACCOUNT_EDIT_IN_PROGRESS:
			return (() => {
				const account = action.payload.account as IAccount;
				const arrCopy = [...state.accountEditsInProgress];
				arrCopy.push(account);
				return {
					...state,
					accountEditsInProgress: arrCopy,
				};
			})();

		case AccountActions.REMOVE_ACCOUNT_EDIT_IN_PROGRESS:
			return (() => {
				const account = action.payload.account as IAccount;
				const idx = state.accountEditsInProgress.findIndex((a) => a.id === account.id);
				if (idx >= 0) {
					const arrCopy = [...state.accountEditsInProgress];
					arrCopy.splice(idx, 1);
					return {
						...state,
						accountEditsInProgress: arrCopy,
					};
				} else {
					return state;
				}
			})();

		default:
			return state;
	}
}

export {
	IAccountsState,
	AccountCacheKeys,
	accountsReducer,
	accountsSagas,
	startDeleteAccount,
	startSaveAccount,
	startSetAccountActive,
	startLoadAccountList,
	setDisplayActiveOnly,
	setAccountToEdit,
	setEditorBusy,
	setAccountList,
};
