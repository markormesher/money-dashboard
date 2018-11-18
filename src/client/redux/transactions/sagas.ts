import axios from "axios";
import { all, call, put, select, takeEvery } from "redux-saga/effects";
import { ThinTransaction } from "../../../server/model-thins/ThinTransaction";
import { setError } from "../global/actions";
import { PayloadAction } from "../PayloadAction";
import { IRootState } from "../root";
import { setEditorBusy, setLastUpdate, setPayeeList, setTransactionToEdit, TransactionsActions } from "./actions";

const lastUpdateSelector = (state: IRootState) => state.transactions.lastUpdate;
const lastLoadSelector = (state: IRootState) => state.transactions.payeeListLastLoaded;

function*deleteTransactionSaga(): Generator {
	yield takeEvery(TransactionsActions.START_DELETE_TRANSACTION, function*(action: PayloadAction): Generator {
		try {
			yield call(() => axios
					.post(`/transactions/delete/${action.payload.transactionId}`)
					.then((res) => res.data));
			yield put(setLastUpdate());
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
				put(setLastUpdate()),
				put(setEditorBusy(false)),
				put(setTransactionToEdit(undefined)),

				// if they were editing a new transaction, keep the editor open with some fields pre-filled
				transactionId === "" && put(setTransactionToEdit(ThinTransaction.getNextForContinuousCreation(transaction))),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*loadPayeeListSaga(): Generator {
	yield takeEvery(TransactionsActions.START_LOAD_PAYEE_LIST, function*(): Generator {
		const lastUpdate = yield select(lastUpdateSelector);
		const lastLoad = yield select(lastLoadSelector);
		if (lastLoad >= lastUpdate) {
			return;
		}
		try {
			const payeeList: string[] = yield call(() => {
				return axios.get("/transactions/payees").then((res) => res.data);
			});
			yield put(setPayeeList(payeeList));
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
