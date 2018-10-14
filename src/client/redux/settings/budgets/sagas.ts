import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinBudget } from "../../../../server/model-thins/ThinBudget";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { BudgetSettingsActions, setBudgetToEdit, setEditorBusy, setLastUpdate } from "./actions";

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

function*saveBudgetSaga() {
	yield takeEvery(BudgetSettingsActions.START_SAVE_BUDGET, function*(action: PayloadAction) {
		try {
			const budget: Partial<ThinBudget> = action.payload.budget;
			const budgetId = budget.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/settings/budgets/edit/${budgetId}`, budget)),
			]);
			yield all([
				put(setLastUpdate()),
				put(setEditorBusy(false)),
				put(setBudgetToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*budgetSettingsSagas() {
	yield all([
		deleteBudgetSaga(),
		saveBudgetSaga(),
	]);
}

export {
	budgetSettingsSagas,
};
