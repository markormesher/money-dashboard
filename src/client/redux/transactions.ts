import axios from "axios";
import { ActionCreator } from "redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinTransaction } from "../../server/model-thins/ThinTransaction";
import { DateModeOption } from "../../server/models/Transaction";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";

interface ITransactionsState {
	readonly dateMode: DateModeOption;
	readonly transactionToEdit: ThinTransaction;
	readonly editorBusy: boolean;
	readonly payeeList: string[];
}

const initialState: ITransactionsState = {
	dateMode: "transaction",
	transactionToEdit: undefined,
	editorBusy: false,
	payeeList: undefined,
};

enum TransactionsActions {
	START_DELETE_TRANSACTION = "TransactionSettingsActions.START_DELETE_TRANSACTION",
	START_SAVE_TRANSACTION = "TransactionSettingsActions.START_SAVE_TRANSACTION",
	START_LOAD_PAYEE_LIST = "TransactionSettingsActions.START_LOAD_PAYEE_LIST",

	SET_DATE_MODE = "TransactionSettingsActions.SET_DATE_MODE",
	SET_TRANSACTION_TO_EDIT = "TransactionSettingsActions.SET_TRANSACTION_TO_EDIT",
	SET_EDITOR_BUSY = "TransactionSettingsActions.SET_EDITOR_BUSY",
	SET_PAYEE_LIST = "TransactionSettingsActions.SET_PAYEE_LIST",
}

const startDeleteTransaction: ActionCreator<PayloadAction> = (transactionId: string) => ({
	type: TransactionsActions.START_DELETE_TRANSACTION,
	payload: { transactionId },
});

const startSaveTransaction: ActionCreator<PayloadAction> = (transaction: Partial<ThinTransaction>) => ({
	type: TransactionsActions.START_SAVE_TRANSACTION,
	payload: { transaction },
});

const startLoadPayeeList: ActionCreator<PayloadAction> = () => ({
	type: TransactionsActions.START_LOAD_PAYEE_LIST,
});

const setDateMode: ActionCreator<PayloadAction> = (dateMode: DateModeOption) => ({
	type: TransactionsActions.SET_DATE_MODE,
	payload: { dateMode },
});

const setTransactionToEdit: ActionCreator<PayloadAction> = (transaction: ThinTransaction) => ({
	type: TransactionsActions.SET_TRANSACTION_TO_EDIT,
	payload: { transaction },
});

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => ({
	type: TransactionsActions.SET_EDITOR_BUSY,
	payload: { editorBusy },
});

const setPayeeList: ActionCreator<PayloadAction> = (payeeList: string[]) => ({
	type: TransactionsActions.SET_PAYEE_LIST,
	payload: { payeeList },
});

function*deleteTransactionSaga(): Generator {
	yield takeEvery(TransactionsActions.START_DELETE_TRANSACTION, function*(action: PayloadAction): Generator {
		try {
			yield call(() => axios
					.post(`/transactions/delete/${action.payload.transactionId}`)
					.then((res) => res.data));
			yield put(KeyCache.touchKey("transactions"));
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*saveTransactionSaga(): Generator {
	yield takeEvery(TransactionsActions.START_SAVE_TRANSACTION, function*(action: PayloadAction): Generator {
		try {
			const transaction: Partial<ThinTransaction> = action.payload.transaction;
			const transactionId = transaction.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/transactions/edit/${transactionId}`, transaction)),
			]);
			yield all([
				put(KeyCache.touchKey("transactions")),
				put(setEditorBusy(false)),

				// always close the editor to reset it...
				put(setTransactionToEdit(undefined)),

				// ...but if they were creating a new transaction, re-open it with some fields pre-filled
				transactionId === "" && put(setTransactionToEdit(ThinTransaction.getNextForContinuousCreation(transaction))),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*loadPayeeListSaga(): Generator {
	yield takeEvery(TransactionsActions.START_LOAD_PAYEE_LIST, function*(): Generator {
		if (KeyCache.keyIsValid("transaction-payee-list", ["transactions"])) {
			return;
		}
		try {
			const payeeList: string[] = yield call(() => {
				return axios.get("/transactions/payees").then((res) => res.data);
			});
			yield all([
				put(setPayeeList(payeeList)),
				put(KeyCache.touchKey("transaction-payee-list")),
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
		case TransactionsActions.SET_DATE_MODE:
			return {
				...state,
				dateMode: action.payload.dateMode,
			};

		case TransactionsActions.SET_TRANSACTION_TO_EDIT:
			return {
				...state,
				transactionToEdit: action.payload.transaction,
			};

		case TransactionsActions.SET_EDITOR_BUSY:
			return {
				...state,
				editorBusy: action.payload.editorBusy,
			};

		case TransactionsActions.SET_PAYEE_LIST:
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
