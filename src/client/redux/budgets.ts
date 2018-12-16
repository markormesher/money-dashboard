import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { IBudget } from "../../server/models/IBudget";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";

interface IBudgetsState {
	readonly displayCurrentOnly: boolean;
	readonly budgetToEdit: IBudget;
	readonly budgetIdsToClone: string[];
	readonly editorBusy: boolean;
}

const initialState: IBudgetsState = {
	displayCurrentOnly: true,
	budgetToEdit: undefined,
	budgetIdsToClone: undefined,
	editorBusy: false,
};

enum BudgetActions {
	START_DELETE_BUDGET = "BudgetActions.START_DELETE_BUDGET",
	START_SAVE_BUDGET = "BudgetActions.START_SAVE_BUDGET",
	START_CLONE_BUDGETS = "BudgetActions.START_CLONE_BUDGETS",

	SET_DISPLAY_CURRENT_ONLY = "BudgetActions.SET_DISPLAY_CURRENT_ONLY",
	SET_BUDGET_TO_EDIT = "BudgetActions.SET_BUDGET_TO_EDIT",
	SET_BUDGETS_TO_CLONE = "BudgetActions.SET_BUDGETS_TO_CLONE",
	SET_EDITOR_BUSY = "BudgetActions.SET_EDITOR_BUSY",
}

enum BudgetCacheKeys {
	BUDGET_DATA = "BudgetCacheKeys.BUDGET_DATA",
}

function startDeleteBudget(budgetId: string): PayloadAction {
	return {
		type: BudgetActions.START_DELETE_BUDGET,
		payload: { budgetId },
	};
}

function startSaveBudget(budget: Partial<IBudget>): PayloadAction {
	return {
		type: BudgetActions.START_SAVE_BUDGET,
		payload: { budget },
	};
}

function startCloneBudgets(budgetIds: string[], startDate: string, endDate: string): PayloadAction {
	return {
		type: BudgetActions.START_CLONE_BUDGETS,
		payload: {
			budgetIds,
			startDate,
			endDate,
		},
	};
}

function setDisplayCurrentOnly(currentOnly: boolean): PayloadAction {
	return {
		type: BudgetActions.SET_DISPLAY_CURRENT_ONLY,
		payload: { currentOnly },
	};
}

function setBudgetToEdit(budget: IBudget): PayloadAction {
	return {
		type: BudgetActions.SET_BUDGET_TO_EDIT,
		payload: { budget },
	};
}

function setBudgetIdsToClone(budgets: string[]): PayloadAction {
	return {
		type: BudgetActions.SET_BUDGETS_TO_CLONE,
		payload: { budgets },
	};
}

function setEditorBusy(editorBusy: boolean): PayloadAction {
	return {
		type: BudgetActions.SET_EDITOR_BUSY,
		payload: { editorBusy },
	};
}

function*deleteBudgetSaga(): Generator {
	yield takeEvery(BudgetActions.START_DELETE_BUDGET, function*(action: PayloadAction): Generator {
		try {
			yield call(() => axios.post(`/budgets/delete/${action.payload.budgetId}`).then((res) => res.data));
			yield put(KeyCache.touchKey(BudgetCacheKeys.BUDGET_DATA));
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*saveBudgetSaga(): Generator {
	yield takeEvery(BudgetActions.START_SAVE_BUDGET, function*(action: PayloadAction): Generator {
		try {
			const budget: Partial<IBudget> = action.payload.budget;
			const budgetId = budget.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/budgets/edit/${budgetId}`, budget)),
			]);
			yield all([
				put(KeyCache.touchKey(BudgetCacheKeys.BUDGET_DATA)),
				put(setEditorBusy(false)),
				put(setBudgetToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*cloneBudgetsSaga(): Generator {
	yield takeEvery(BudgetActions.START_CLONE_BUDGETS, function*(action: PayloadAction): Generator {
		try {
			const budgetIds: string[] = action.payload.budgetIds;
			const startDate: string = action.payload.startDate;
			const endDate: string = action.payload.endDate;
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post("/budgets/clone", {
					budgetIds,
					startDate,
					endDate,
				})),
			]);
			yield all([
				put(KeyCache.touchKey(BudgetCacheKeys.BUDGET_DATA)),
				put(setEditorBusy(false)),
				put(setBudgetIdsToClone(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*budgetsSagas(): Generator {
	yield all([
		deleteBudgetSaga(),
		saveBudgetSaga(),
		cloneBudgetsSaga(),
	]);
}

function budgetsReducer(state = initialState, action: PayloadAction): IBudgetsState {
	switch (action.type) {
		case BudgetActions.SET_DISPLAY_CURRENT_ONLY:
			return {
				...state,
				displayCurrentOnly: action.payload.currentOnly,
			};

		case BudgetActions.SET_BUDGET_TO_EDIT:
			return {
				...state,
				budgetToEdit: action.payload.budget,
			};

		case BudgetActions.SET_BUDGETS_TO_CLONE:
			return {
				...state,
				budgetIdsToClone: action.payload.budgets,
			};

		case BudgetActions.SET_EDITOR_BUSY:
			return {
				...state,
				editorBusy: action.payload.editorBusy,
			};

		default:
			return state;
	}
}

export {
	IBudgetsState,
	BudgetCacheKeys,
	budgetsReducer,
	budgetsSagas,
	startDeleteBudget,
	startSaveBudget,
	startCloneBudgets,
	setDisplayCurrentOnly,
	setBudgetToEdit,
	setBudgetIdsToClone,
	setEditorBusy,
};
