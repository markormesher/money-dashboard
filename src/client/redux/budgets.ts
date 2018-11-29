import axios from "axios";
import { ActionCreator } from "redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinBudget } from "../../server/model-thins/ThinBudget";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";

interface IBudgetSettingsState {
	readonly displayCurrentOnly: boolean;
	readonly budgetToEdit: ThinBudget;
	readonly budgetIdsToClone: string[];
	readonly editorBusy: boolean;
}

const initialState: IBudgetSettingsState = {
	displayCurrentOnly: true,
	budgetToEdit: undefined,
	budgetIdsToClone: undefined,
	editorBusy: false,
};

enum BudgetSettingsActions {
	START_DELETE_BUDGET = "BudgetSettingsActions.START_DELETE_BUDGET",
	START_SAVE_BUDGET = "BudgetSettingsActions.START_SAVE_BUDGET",
	START_CLONE_BUDGETS = "BudgetSettingsActions.START_CLONE_BUDGETS",

	SET_DISPLAY_CURRENT_ONLY = "BudgetSettingsActions.SET_DISPLAY_CURRENT_ONLY",
	SET_BUDGET_TO_EDIT = "BudgetSettingsActions.SET_BUDGET_TO_EDIT",
	SET_BUDGETS_TO_CLONE = "BudgetSettingsActions.SET_BUDGETS_TO_CLONE",
	SET_EDITOR_BUSY = "BudgetSettingsActions.SET_EDITOR_BUSY",
}

const startDeleteBudget: ActionCreator<PayloadAction> = (budgetId: string) => ({
	type: BudgetSettingsActions.START_DELETE_BUDGET,
	payload: { budgetId },
});

const startSaveBudget: ActionCreator<PayloadAction> = (budget: Partial<ThinBudget>) => ({
	type: BudgetSettingsActions.START_SAVE_BUDGET,
	payload: { budget },
});

const startCloneBudgets: ActionCreator<PayloadAction> = (budgetIds: string[], startDate: string, endDate: string) => ({
	type: BudgetSettingsActions.START_CLONE_BUDGETS,
	payload: {
		budgetIds,
		startDate,
		endDate,
	},
});

const setDisplayCurrentOnly: ActionCreator<PayloadAction> = (currentOnly: boolean) => ({
	type: BudgetSettingsActions.SET_DISPLAY_CURRENT_ONLY,
	payload: { currentOnly },
});

const setBudgetToEdit: ActionCreator<PayloadAction> = (budget: ThinBudget) => ({
	type: BudgetSettingsActions.SET_BUDGET_TO_EDIT,
	payload: { budget },
});

const setBudgetIdsToClone: ActionCreator<PayloadAction> = (budgets: string[]) => ({
	type: BudgetSettingsActions.SET_BUDGETS_TO_CLONE,
	payload: { budgets },
});

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => ({
	type: BudgetSettingsActions.SET_EDITOR_BUSY,
	payload: { editorBusy },
});

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

function budgetSettingsReducer(state = initialState, action: PayloadAction): IBudgetSettingsState {
	switch (action.type) {
		case BudgetSettingsActions.SET_DISPLAY_CURRENT_ONLY:
			return {
				...state,
				displayCurrentOnly: action.payload.currentOnly,
			};

		case BudgetSettingsActions.SET_BUDGET_TO_EDIT:
			return {
				...state,
				budgetToEdit: action.payload.budget,
			};

		case BudgetSettingsActions.SET_BUDGETS_TO_CLONE:
			return {
				...state,
				budgetIdsToClone: action.payload.budgets,
			};

		case BudgetSettingsActions.SET_EDITOR_BUSY:
			return {
				...state,
				editorBusy: action.payload.editorBusy,
			};

		default:
			return state;
	}
}

export {
	IBudgetSettingsState,
	budgetSettingsReducer,
	budgetSettingsSagas,
	startDeleteBudget,
	startSaveBudget,
	startCloneBudgets,
	setDisplayCurrentOnly,
	setBudgetToEdit,
	setBudgetIdsToClone,
	setEditorBusy,
};
