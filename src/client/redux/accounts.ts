import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { IAccount, mapAccountFromApi } from "../../models/IAccount";
import { globalErrorManager } from "../helpers/errors/error-manager";
import { PayloadAction } from "./helpers/PayloadAction";

interface IAccountsState {
  readonly accountList: IAccount[];
}

const initialState: IAccountsState = {
  accountList: undefined,
};

enum AccountActions {
  START_LOAD_ACCOUNT_LIST = "AccountActions.START_LOAD_ACCOUNT_LIST",
  SET_ACCOUNT_LIST = "AccountActions.SET_ACCOUNT_LIST",
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

function startLoadAccountList(): PayloadAction {
  return {
    type: AccountActions.START_LOAD_ACCOUNT_LIST,
  };
}

function setAccountList(accountList: IAccount[]): PayloadAction {
  return {
    type: AccountActions.SET_ACCOUNT_LIST,
    payload: { accountList },
  };
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
      globalErrorManager.emitFatalError(err);
    }
  });
}

function* accountsSagas(): Generator {
  yield all([loadAccountListSaga()]);
}

function accountsReducer(state = initialState, action: PayloadAction): IAccountsState {
  switch (action.type) {
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
  AccountActions,
  AccountCacheKeys,
  accountsReducer,
  accountsSagas,
  accountListIsCached,
  startLoadAccountList,
  setAccountList,
};
