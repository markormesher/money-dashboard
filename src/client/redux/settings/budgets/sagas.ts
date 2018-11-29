import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinBudget } from "../../../../server/model-thins/ThinBudget";
import { KeyCache } from "../../caching/key-cache";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { BudgetSettingsActions, setBudgetIdsToClone, setBudgetToEdit, setEditorBusy } from "./actions";

function*deleteBudgetSaga(): Generator {
	yield takeEvery(BudgetSettingsActions.START_DELETE_BUDGET, function*(action: PayloadAction): Generator {
		try {
			yield call(() => axios.post(`/settings/budgets/delete/${action.payload.budgetId}`).then((res) => res.data));
			yield put(KeyCache.touchKey("budgets"));
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*saveBudgetSaga(): Generator {
	yield takeEvery(BudgetSettingsActions.START_SAVE_BUDGET, function*(action: PayloadAction): Generator {
		try {
			const budget: Partial<ThinBudget> = action.payload.budget;
			const budgetId = budget.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/settings/budgets/edit/${budgetId}`, budget)),
			]);
			yield all([
				put(KeyCache.touchKey("budgets")),
				put(setEditorBusy(false)),
				put(setBudgetToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*cloneBudgetsSaga(): Generator {
	yield takeEvery(BudgetSettingsActions.START_CLONE_BUDGETS, function*(action: PayloadAction): Generator {
		try {
			const budgetIds: string[] = action.payload.budgetIds;
			const startDate: string = action.payload.startDate;
			const endDate: string = action.payload.endDate;
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post("/settings/budgets/clone", {
					budgetIds,
					startDate,
					endDate,
				})),
			]);
			yield all([
				put(KeyCache.touchKey("budgets")),
				put(setEditorBusy(false)),
				put(setBudgetIdsToClone(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*budgetSettingsSagas(): Generator {
	yield all([
		deleteBudgetSaga(),
		saveBudgetSaga(),
		cloneBudgetsSaga(),
	]);
}

export {
	budgetSettingsSagas,
};
