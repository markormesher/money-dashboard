import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { IAccount, mapAccountFromApi, mapAccountForApi } from "../../models/IAccount";
import { setError } from "./global";
import { PayloadAction } from "./helpers/PayloadAction";

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

// direct call to library method is deliberately not tested
/* istanbul ignore next */
function accountListIsCached(): boolean {
  return CacheKeyUtil.keyIsValid(AccountCacheKeys.ACCOUNT_LIST, [AccountCacheKeys.ACCOUNT_DATA]);
}

function startDeleteAccount(account: IAccount): PayloadAction {
  return {
    type: AccountActions.START_DELETE_ACCOUNT,
    payload: { account },
  };
}

function startSaveAccount(account: Partial<IAccount>): PayloadAction {
  return {
    type: AccountActions.START_SAVE_ACCOUNT,
    payload: { account },
  };
}

function startSetAccountActive(account: IAccount, active: boolean): PayloadAction {
  return {
    type: AccountActions.START_SET_ACCOUNT_ACTIVE,
    payload: { account, active },
  };
}

function startLoadAccountList(): PayloadAction {
  return {
    type: AccountActions.START_LOAD_ACCOUNT_LIST,
  };
}

function setDisplayActiveOnly(activeOnly: boolean): PayloadAction {
  return {
    type: AccountActions.SET_DISPLAY_ACTIVE_ONLY,
    payload: { activeOnly },
  };
}

function setAccountToEdit(account: IAccount): PayloadAction {
  return {
    type: AccountActions.SET_ACCOUNT_TO_EDIT,
    payload: { account },
  };
}

function setEditorBusy(editorBusy: boolean): PayloadAction {
  return {
    type: AccountActions.SET_EDITOR_BUSY,
    payload: { editorBusy },
  };
}

function setAccountList(accountList: IAccount[]): PayloadAction {
  return {
    type: AccountActions.SET_ACCOUNT_LIST,
    payload: { accountList },
  };
}

function addAccountEditInProgress(account: IAccount): PayloadAction {
  return {
    type: AccountActions.ADD_ACCOUNT_EDIT_IN_PROGRESS,
    payload: { account },
  };
}

function removeAccountEditInProgress(account: IAccount): PayloadAction {
  return {
    type: AccountActions.REMOVE_ACCOUNT_EDIT_IN_PROGRESS,
    payload: { account },
  };
}

function* deleteAccountSaga(): Generator {
  yield takeEvery(AccountActions.START_DELETE_ACCOUNT, function* (action: PayloadAction): Generator {
    try {
      const account: IAccount = action.payload.account;
      yield call(() => axios.post(`/api/accounts/delete/${account.id}`));
      yield put(CacheKeyUtil.updateKey(AccountCacheKeys.ACCOUNT_DATA));
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* saveAccountSaga(): Generator {
  yield takeEvery(AccountActions.START_SAVE_ACCOUNT, function* (action: PayloadAction): Generator {
    try {
      const account: Partial<IAccount> = mapAccountForApi(action.payload.account);
      const accountId = account.id || "";
      yield all([put(setEditorBusy(true)), call(() => axios.post(`/api/accounts/edit/${accountId}`, account))]);
      yield all([
        put(CacheKeyUtil.updateKey(AccountCacheKeys.ACCOUNT_DATA)),
        put(setEditorBusy(false)),
        put(setAccountToEdit(undefined)),
      ]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* setAccountActiveSaga(): Generator {
  yield takeEvery(AccountActions.START_SET_ACCOUNT_ACTIVE, function* (action: PayloadAction): Generator {
    try {
      const account: IAccount = action.payload.account;
      const active: boolean = action.payload.active;
      const apiRoute = active ? "set-active" : "set-inactive";
      yield all([
        put(addAccountEditInProgress(account)),
        call(() => axios.post(`/api/accounts/${apiRoute}/${account.id}`)),
      ]);
      yield all([
        put(CacheKeyUtil.updateKey(AccountCacheKeys.ACCOUNT_DATA)),
        put(removeAccountEditInProgress(account)),
      ]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* loadAccountListSaga(): Generator {
  yield takeEvery(AccountActions.START_LOAD_ACCOUNT_LIST, function* (): Generator {
    if (accountListIsCached()) {
      return;
    }
    try {
      const accountList: IAccount[] = (yield call(async () => {
        const res = await axios.get("/api/accounts/list");
        const raw: IAccount[] = res.data;
        return raw.map(mapAccountFromApi);
      })) as IAccount[];
      yield all([put(setAccountList(accountList)), put(CacheKeyUtil.updateKey(AccountCacheKeys.ACCOUNT_LIST))]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* accountsSagas(): Generator {
  yield all([deleteAccountSaga(), saveAccountSaga(), setAccountActiveSaga(), loadAccountListSaga()]);
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
      return ((): IAccountsState => {
        const account = action.payload.account as IAccount;
        const arrCopy = [...state.accountEditsInProgress];
        arrCopy.push(account);
        return {
          ...state,
          accountEditsInProgress: arrCopy,
        };
      })();

    case AccountActions.REMOVE_ACCOUNT_EDIT_IN_PROGRESS:
      return ((): IAccountsState => {
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
  AccountActions,
  AccountCacheKeys,
  accountsReducer,
  accountsSagas,
  accountListIsCached,
  startDeleteAccount,
  startSaveAccount,
  startSetAccountActive,
  startLoadAccountList,
  setDisplayActiveOnly,
  setAccountToEdit,
  setEditorBusy,
  setAccountList,
  addAccountEditInProgress,
  removeAccountEditInProgress,
};
