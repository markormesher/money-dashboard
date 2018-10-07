import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { BudgetSettingsActions, setLastUpdate } from "./actions";

function*deleteBudgetSaga() {
	yield takeEvery(BudgetSettingsActions.START_DELETE_BUDGET, function*(action: PayloadAction) {
		try {
			yield call(() => axios.post(`/settings/budgets/delete/${action.payload.budgetId}`).then((res) => res.data));
			yield put(setLastUpdate());
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*budgetSettingsSagas() {
	yield all([
		deleteBudgetSaga(),
	]);
}

export {
	budgetSettingsSagas,
};
