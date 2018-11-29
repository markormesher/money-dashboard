import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinTransaction } from "../../../server/model-thins/ThinTransaction";
import { KeyCache } from "../caching/KeyCache";
import { setError } from "../global/actions";
import { PayloadAction } from "../PayloadAction";
import { setEditorBusy, setPayeeList, setTransactionToEdit, TransactionsActions } from "./actions";

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

export {
	transactionsSagas,
};
