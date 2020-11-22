import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { IAccountBalance } from "../../commons/models/IAccountBalance";
import { mapBudgetFromApi } from "../../commons/models/IBudget";
import { IBudgetBalance } from "../../commons/models/IBudgetBalance";
import { ICategoryBalance } from "../../commons/models/ICategoryBalance";
import { IAccountBalanceUpdate } from "../../commons/models/IAccountBalanceUpdate";
import { AccountCacheKeys } from "./accounts";
import { BudgetCacheKeys } from "./budgets";
import { setError } from "./global";
import { PayloadAction } from "./helpers/PayloadAction";
import { ProfileCacheKeys } from "./profiles";
import { TransactionCacheKeys } from "./transactions";

interface IDashboardState {
  readonly accountBalances?: IAccountBalance[];
  readonly budgetBalances?: IBudgetBalance[];
  readonly memoCategoryBalances?: ICategoryBalance[];
  readonly assetBalanceToUpdate?: IAccountBalance;
  readonly assetBalanceUpdateEditorBusy?: boolean;
  readonly assetBalanceUpdateError?: string;
}

const initialState: IDashboardState = {
  accountBalances: undefined,
  budgetBalances: undefined,
  memoCategoryBalances: undefined,
  assetBalanceToUpdate: undefined,
  assetBalanceUpdateEditorBusy: false,
  assetBalanceUpdateError: undefined,
};

enum DashboardActions {
  START_LOAD_ACCOUNT_BALANCES = "DashboardActions.START_LOAD_ACCOUNT_BALANCES",
  START_LOAD_BUDGET_BALANCES = "DashboardActions.START_LOAD_BUDGET_BALANCES",
  START_LOAD_MEMO_CATEGORY_BALANCES = "DashboardActions.START_LOAD_MEMO_CATEGORY_BALANCES",
  START_SAVE_ASSET_BALANCE_UPDATE = "DashboardActions.START_SAVE_ASSET_BALANCE_UPDATE",

  SET_ACCOUNT_BALANCES = "DashboardActions.SET_ACCOUNT_BALANCES",
  SET_BUDGET_BALANCES = "DashboardActions.SET_BUDGET_BALANCES",
  SET_MEMO_CATEGORY_BALANCES = "DashboardActions.SET_MEMO_CATEGORY_BALANCES",
  SET_ASSET_BALANCE_TO_UPDATE = "DashboardActions.SET_ASSET_BALANCE_TO_UPDATE",
  SET_ASSET_BALANCE_UPDATE_EDITOR_BUSY = "DashboardActions.SET_ASSET_BALANCE_UPDATE_EDITOR_BUSY",
  SET_ASSET_BALANCE_UPDATE_ERROR = "DashboardActions.SET_ASSET_BALANCE_UPDATE_ERROR",
}

enum DashboardCacheKeys {
  ACCOUNT_BALANCES = "DashboardCacheKeys.ACCOUNT_BALANCES",
  BUDGET_BALANCES = "DashboardCacheKeys.BUDGET_BALANCES",
  MEMO_CATEGORY_BALANCE = "DashboardCacheKeys.MEMO_CATEGORY_BALANCE",
}

function startLoadAccountBalances(): PayloadAction {
  return {
    type: DashboardActions.START_LOAD_ACCOUNT_BALANCES,
  };
}

function startLoadBudgetBalances(): PayloadAction {
  return {
    type: DashboardActions.START_LOAD_BUDGET_BALANCES,
  };
}

function startLoadMemoCategoryBalances(): PayloadAction {
  return {
    type: DashboardActions.START_LOAD_MEMO_CATEGORY_BALANCES,
  };
}

function startSaveAssetBalanceUpdate(assetBalanceUpdate: IAccountBalanceUpdate): PayloadAction {
  return {
    type: DashboardActions.START_SAVE_ASSET_BALANCE_UPDATE,
    payload: { assetBalanceUpdate },
  };
}

function setAssetBalanceToUpdate(assetBalance: IAccountBalance): PayloadAction {
  return {
    type: DashboardActions.SET_ASSET_BALANCE_TO_UPDATE,
    payload: { assetBalance },
  };
}

function setAssetBalanceUpdateEditorBusy(busy: boolean): PayloadAction {
  return {
    type: DashboardActions.SET_ASSET_BALANCE_UPDATE_EDITOR_BUSY,
    payload: { busy },
  };
}

function setAssetBalanceUpdateError(error: string): PayloadAction {
  return {
    type: DashboardActions.SET_ASSET_BALANCE_UPDATE_ERROR,
    payload: { error },
  };
}

function setAccountBalances(accountBalances: IAccountBalance[]): PayloadAction {
  return {
    type: DashboardActions.SET_ACCOUNT_BALANCES,
    payload: { accountBalances },
  };
}

function setBudgetBalances(budgetBalances: IBudgetBalance[]): PayloadAction {
  return {
    type: DashboardActions.SET_BUDGET_BALANCES,
    payload: { budgetBalances },
  };
}

function setMemoCategoryBalances(memoCategoryBalances: ICategoryBalance[]): PayloadAction {
  return {
    type: DashboardActions.SET_MEMO_CATEGORY_BALANCES,
    payload: { memoCategoryBalances },
  };
}

function* loadAccountBalancesSaga(): Generator {
  yield takeEvery(DashboardActions.START_LOAD_ACCOUNT_BALANCES, function*(): Generator {
    if (
      CacheKeyUtil.keyIsValid(DashboardCacheKeys.ACCOUNT_BALANCES, [
        TransactionCacheKeys.TRANSACTION_DATA,
        AccountCacheKeys.ACCOUNT_DATA,
        ProfileCacheKeys.ACTIVE_PROFILE,
      ])
    ) {
      return;
    }
    try {
      const balances: IAccountBalance[] = yield call(() => {
        return axios.get("/api/accounts/balances").then((res) => res.data);
      });
      yield all([put(setAccountBalances(balances)), put(CacheKeyUtil.updateKey(DashboardCacheKeys.ACCOUNT_BALANCES))]);
    } catch (err) {
      yield all([put(setError(err))]);
    }
  });
}

function* loadBudgetBalancesSaga(): Generator {
  yield takeEvery(DashboardActions.START_LOAD_BUDGET_BALANCES, function*(): Generator {
    if (
      CacheKeyUtil.keyIsValid(DashboardCacheKeys.BUDGET_BALANCES, [
        TransactionCacheKeys.TRANSACTION_DATA,
        BudgetCacheKeys.BUDGET_DATA,
        ProfileCacheKeys.ACTIVE_PROFILE,
      ])
    ) {
      return;
    }
    try {
      const balances: IBudgetBalance[] = yield call(() => {
        return axios.get("/api/budgets/balances").then((res) => {
          const raw: IBudgetBalance[] = res.data;
          return raw.map((rawItem) => ({
            ...rawItem,
            budget: mapBudgetFromApi(rawItem.budget),
          }));
        });
      });
      yield all([put(setBudgetBalances(balances)), put(CacheKeyUtil.updateKey(DashboardCacheKeys.BUDGET_BALANCES))]);
    } catch (err) {
      yield all([put(setError(err))]);
    }
  });
}

function* loadMemoCategoryBalancesSaga(): Generator {
  yield takeEvery(DashboardActions.START_LOAD_MEMO_CATEGORY_BALANCES, function*(): Generator {
    if (
      CacheKeyUtil.keyIsValid(DashboardCacheKeys.MEMO_CATEGORY_BALANCE, [
        TransactionCacheKeys.TRANSACTION_DATA,
        ProfileCacheKeys.ACTIVE_PROFILE,
      ])
    ) {
      return;
    }
    try {
      const balances: ICategoryBalance[] = yield call(() => {
        return axios.get("/api/categories/memo-balances").then((res) => res.data);
      });
      yield all([
        put(setMemoCategoryBalances(balances)),
        put(CacheKeyUtil.updateKey(DashboardCacheKeys.MEMO_CATEGORY_BALANCE)),
      ]);
    } catch (err) {
      yield all([put(setError(err))]);
    }
  });
}

function* saveAssetBalanceUpdate(): Generator {
  yield takeEvery(DashboardActions.START_SAVE_ASSET_BALANCE_UPDATE, function*(action: PayloadAction): Generator {
    try {
      const balanceUpdate: IAccountBalanceUpdate = action.payload.assetBalanceUpdate;
      yield put(setAssetBalanceUpdateEditorBusy(true));
      const result: string = yield call(() => {
        return axios.post("/api/accounts/asset-balance-update", { balanceUpdate }).then((res) => res.data);
      });
      if (result === "done") {
        yield all([
          put(setAssetBalanceToUpdate(undefined)),
          put(setAssetBalanceUpdateError(undefined)),
          put(setAssetBalanceUpdateEditorBusy(false)),
          put(CacheKeyUtil.updateKey(TransactionCacheKeys.TRANSACTION_DATA)),
        ]);
        yield put(startLoadAccountBalances());
      } else {
        yield all([put(setAssetBalanceUpdateError(result)), put(setAssetBalanceUpdateEditorBusy(false))]);
      }
    } catch (err) {
      yield all([put(setError(err))]);
    }
  });
}

function* dashboardSagas(): Generator {
  yield all([
    loadAccountBalancesSaga(),
    loadBudgetBalancesSaga(),
    loadMemoCategoryBalancesSaga(),
    saveAssetBalanceUpdate(),
  ]);
}

function dashboardReducer(state: IDashboardState = initialState, action: PayloadAction): IDashboardState {
  switch (action.type) {
    case DashboardActions.SET_ACCOUNT_BALANCES:
      return {
        ...state,
        accountBalances: action.payload.accountBalances,
      };

    case DashboardActions.SET_BUDGET_BALANCES:
      return {
        ...state,
        budgetBalances: action.payload.budgetBalances,
      };

    case DashboardActions.SET_MEMO_CATEGORY_BALANCES:
      return {
        ...state,
        memoCategoryBalances: action.payload.memoCategoryBalances,
      };

    case DashboardActions.SET_ASSET_BALANCE_TO_UPDATE:
      return {
        ...state,
        assetBalanceToUpdate: action.payload.assetBalance,

        // also clear any leftover state when setting an asset to update
        assetBalanceUpdateEditorBusy: false,
        assetBalanceUpdateError: undefined,
      };

    case DashboardActions.SET_ASSET_BALANCE_UPDATE_EDITOR_BUSY:
      return {
        ...state,
        assetBalanceUpdateEditorBusy: action.payload.busy,
      };

    case DashboardActions.SET_ASSET_BALANCE_UPDATE_ERROR:
      return {
        ...state,
        assetBalanceUpdateError: action.payload.error,
      };

    default:
      return state;
  }
}

export {
  IDashboardState,
  DashboardActions,
  dashboardReducer,
  dashboardSagas,
  startLoadAccountBalances,
  startLoadBudgetBalances,
  startLoadMemoCategoryBalances,
  startSaveAssetBalanceUpdate,
  setAssetBalanceToUpdate,
  setAssetBalanceUpdateEditorBusy,
  setAssetBalanceUpdateError,
  setAccountBalances,
  setBudgetBalances,
  setMemoCategoryBalances,
};
