import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import {
  DateModeOption,
  getNextTransactionForContinuousCreation,
  ITransaction,
  mapTransactionForApi,
} from "../../models/ITransaction";
import { setError } from "./global";
import { PayloadAction } from "./helpers/PayloadAction";

interface ITransactionsState {
  readonly dateMode: DateModeOption;
  readonly transactionToEdit: ITransaction;
  readonly editorBusy: boolean;
  readonly payeeList: string[];
}

const initialState: ITransactionsState = {
  dateMode: "transaction",
  transactionToEdit: undefined,
  editorBusy: false,
  payeeList: undefined,
};

enum TransactionActions {
  START_DELETE_TRANSACTION = "TransactionSettingsActions.START_DELETE_TRANSACTION",
  START_SAVE_TRANSACTION = "TransactionSettingsActions.START_SAVE_TRANSACTION",
  START_LOAD_PAYEE_LIST = "TransactionSettingsActions.START_LOAD_PAYEE_LIST",

  SET_DATE_MODE = "TransactionSettingsActions.SET_DATE_MODE",
  SET_TRANSACTION_TO_EDIT = "TransactionSettingsActions.SET_TRANSACTION_TO_EDIT",
  SET_EDITOR_BUSY = "TransactionSettingsActions.SET_EDITOR_BUSY",
  SET_PAYEE_LIST = "TransactionSettingsActions.SET_PAYEE_LIST",
}

enum TransactionCacheKeys {
  PAYEE_LIST = "TransactionsCacheKeys.PAYEE_LIST",
  TRANSACTION_DATA = "TransactionsCacheKeys.TRANSACTION_DATA",
}

function startDeleteTransaction(transaction: ITransaction): PayloadAction {
  return {
    type: TransactionActions.START_DELETE_TRANSACTION,
    payload: { transaction },
  };
}

function startSaveTransaction(transaction: Partial<ITransaction>): PayloadAction {
  return {
    type: TransactionActions.START_SAVE_TRANSACTION,
    payload: { transaction },
  };
}

function startLoadPayeeList(): PayloadAction {
  return {
    type: TransactionActions.START_LOAD_PAYEE_LIST,
  };
}

function setDateMode(dateMode: DateModeOption): PayloadAction {
  return {
    type: TransactionActions.SET_DATE_MODE,
    payload: { dateMode },
  };
}

function setTransactionToEdit(transaction: ITransaction): PayloadAction {
  return {
    type: TransactionActions.SET_TRANSACTION_TO_EDIT,
    payload: { transaction },
  };
}

function setEditorBusy(editorBusy: boolean): PayloadAction {
  return {
    type: TransactionActions.SET_EDITOR_BUSY,
    payload: { editorBusy },
  };
}

function setPayeeList(payeeList: string[]): PayloadAction {
  return {
    type: TransactionActions.SET_PAYEE_LIST,
    payload: { payeeList },
  };
}

function* deleteTransactionSaga(): Generator {
  yield takeEvery(TransactionActions.START_DELETE_TRANSACTION, function* (action: PayloadAction): Generator {
    try {
      const transaction: ITransaction = action.payload.transaction;
      yield call(() => axios.post(`/api/transactions/delete/${transaction.id}`));
      yield put(CacheKeyUtil.updateKey(TransactionCacheKeys.TRANSACTION_DATA));
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* saveTransactionSaga(): Generator {
  yield takeEvery(TransactionActions.START_SAVE_TRANSACTION, function* (action: PayloadAction): Generator {
    try {
      const transaction: Partial<ITransaction> = mapTransactionForApi(action.payload.transaction);
      const transactionId = transaction.id || "";
      yield all([
        put(setEditorBusy(true)),
        call(() => axios.post(`/api/transactions/edit/${transactionId}`, transaction)),
      ]);
      yield all([
        put(CacheKeyUtil.updateKey(TransactionCacheKeys.TRANSACTION_DATA)),
        put(setEditorBusy(false)),

        // always close the editor to reset it...
        put(setTransactionToEdit(undefined)),

        // ...but if they were creating a new transaction, re-open it with some fields pre-filled
        transactionId === "" && put(setTransactionToEdit(getNextTransactionForContinuousCreation(transaction))),
      ]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* loadPayeeListSaga(): Generator {
  yield takeEvery(TransactionActions.START_LOAD_PAYEE_LIST, function* (): Generator {
    if (CacheKeyUtil.keyIsValid(TransactionCacheKeys.PAYEE_LIST, [TransactionCacheKeys.TRANSACTION_DATA])) {
      return;
    }
    try {
      const payeeList: string[] = (yield call(async () => {
        const res = await axios.get("/api/transactions/payees");
        return res.data;
      })) as string[];
      yield all([put(setPayeeList(payeeList)), put(CacheKeyUtil.updateKey(TransactionCacheKeys.PAYEE_LIST))]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* transactionsSagas(): Generator {
  yield all([deleteTransactionSaga(), saveTransactionSaga(), loadPayeeListSaga()]);
}

function transactionsReducer(state = initialState, action: PayloadAction): ITransactionsState {
  switch (action.type) {
    case TransactionActions.SET_DATE_MODE:
      return {
        ...state,
        dateMode: action.payload.dateMode,
      };

    case TransactionActions.SET_TRANSACTION_TO_EDIT:
      return {
        ...state,
        transactionToEdit: action.payload.transaction,
      };

    case TransactionActions.SET_EDITOR_BUSY:
      return {
        ...state,
        editorBusy: action.payload.editorBusy,
      };

    case TransactionActions.SET_PAYEE_LIST:
      return {
        ...state,
        payeeList: action.payload.payeeList,
      };

    default:
      return state;
  }
}

export {
  ITransactionsState,
  TransactionActions,
  TransactionCacheKeys,
  transactionsReducer,
  transactionsSagas,
  startDeleteTransaction,
  startSaveTransaction,
  startLoadPayeeList,
  setDateMode,
  setTransactionToEdit,
  setEditorBusy,
  setPayeeList,
};
