import axios from "axios";
import { ActionCreator } from "redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import {
	DateModeOption,
	getNextTransactionForContinuousCreation,
	ITransaction,
} from "../../server/models/ITransaction";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";
import { ProfileCacheKeys } from "./profiles";

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

const startDeleteTransaction: ActionCreator<PayloadAction> = (transactionId: string) => ({
	type: TransactionActions.START_DELETE_TRANSACTION,
	payload: { transactionId },
});

const startSaveTransaction: ActionCreator<PayloadAction> = (transaction: Partial<ITransaction>) => ({
	type: TransactionActions.START_SAVE_TRANSACTION,
	payload: { transaction },
});

const startLoadPayeeList: ActionCreator<PayloadAction> = () => ({
	type: TransactionActions.START_LOAD_PAYEE_LIST,
});

const setDateMode: ActionCreator<PayloadAction> = (dateMode: DateModeOption) => ({
	type: TransactionActions.SET_DATE_MODE,
	payload: { dateMode },
});

const setTransactionToEdit: ActionCreator<PayloadAction> = (transaction: ITransaction) => ({
	type: TransactionActions.SET_TRANSACTION_TO_EDIT,
	payload: { transaction },
});

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => ({
	type: TransactionActions.SET_EDITOR_BUSY,
	payload: { editorBusy },
});

const setPayeeList: ActionCreator<PayloadAction> = (payeeList: string[]) => ({
	type: TransactionActions.SET_PAYEE_LIST,
	payload: { payeeList },
});

function*deleteTransactionSaga(): Generator {
	yield takeEvery(TransactionActions.START_DELETE_TRANSACTION, function*(action: PayloadAction): Generator {
		try {
			yield call(() => axios
					.post(`/transactions/delete/${action.payload.transactionId}`)
					.then((res) => res.data));
			yield put(KeyCache.touchKey(TransactionCacheKeys.TRANSACTION_DATA));
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*saveTransactionSaga(): Generator {
	yield takeEvery(TransactionActions.START_SAVE_TRANSACTION, function*(action: PayloadAction): Generator {
		try {
			const transaction: Partial<ITransaction> = action.payload.transaction;
			const transactionId = transaction.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/transactions/edit/${transactionId}`, transaction)),
			]);
			yield all([
				put(KeyCache.touchKey(TransactionCacheKeys.TRANSACTION_DATA)),
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

function*loadPayeeListSaga(): Generator {
	yield takeEvery(TransactionActions.START_LOAD_PAYEE_LIST, function*(): Generator {
		if (KeyCache.keyIsValid(TransactionCacheKeys.PAYEE_LIST, [
			TransactionCacheKeys.TRANSACTION_DATA,
			ProfileCacheKeys.CURRENT_PROFILE,
		])) {
			return;
		}
		try {
			const payeeList: string[] = yield call(() => {
				return axios.get("/transactions/payees").then((res) => res.data);
			});
			yield all([
				put(setPayeeList(payeeList)),
				put(KeyCache.touchKey(TransactionCacheKeys.PAYEE_LIST)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*transactionsSagas(): Generator {
	yield all([
		deleteTransactionSaga(),
		saveTransactionSaga(),
		loadPayeeListSaga(),
	]);
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
