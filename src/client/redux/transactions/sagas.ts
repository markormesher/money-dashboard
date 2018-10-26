import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinTransaction } from "../../../server/model-thins/ThinTransaction";
import { setError } from "../global/actions";
import { PayloadAction } from "../PayloadAction";
import { setEditorBusy, setLastUpdate, setTransactionToEdit, TransactionsActions } from "./actions";

function*deleteTransactionSaga() {
	yield takeEvery(TransactionsActions.START_DELETE_TRANSACTION, function*(action: PayloadAction) {
		try {
			yield call(() => axios
					.post(`/settings/transactions/delete/${action.payload.transactionId}`)
					.then((res) => res.data));
			yield put(setLastUpdate());
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*saveTransactionSaga() {
	yield takeEvery(TransactionsActions.START_SAVE_TRANSACTION, function*(action: PayloadAction) {
		try {
			const transaction: Partial<ThinTransaction> = action.payload.transaction;
			const transactionId = transaction.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/settings/transactions/edit/${transactionId}`, transaction)),
			]);
			yield all([
				put(setLastUpdate()),
				put(setEditorBusy(false)),
				put(setTransactionToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*transactionsSagas() {
	yield all([
		deleteTransactionSaga(),
		saveTransactionSaga(),
	]);
}

export {
	transactionsSagas,
};
