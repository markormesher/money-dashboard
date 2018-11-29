import { ActionCreator } from "redux";
import { ThinBudget } from "../../../../server/model-thins/ThinBudget";
import { PayloadAction } from "../../PayloadAction";

enum BudgetSettingsActions {
	START_DELETE_BUDGET = "BudgetSettingsActions.START_DELETE_BUDGET",
	START_SAVE_BUDGET = "BudgetSettingsActions.START_SAVE_BUDGET",
	START_CLONE_BUDGETS = "BudgetSettingsActions.START_CLONE_BUDGETS",

	SET_DISPLAY_CURRENT_ONLY = "BudgetSettingsActions.SET_DISPLAY_CURRENT_ONLY",
	SET_BUDGET_TO_EDIT = "BudgetSettingsActions.SET_BUDGET_TO_EDIT",
	SET_BUDGETS_TO_CLONE = "BudgetSettingsActions.SET_BUDGETS_TO_CLONE",
	SET_EDITOR_BUSY = "BudgetSettingsActions.SET_EDITOR_BUSY",
}

const startDeleteBudget: ActionCreator<PayloadAction> = (budgetId: string) => {
	return {
		type: BudgetSettingsActions.START_DELETE_BUDGET, payload: { budgetId },
	};
};

const startSaveBudget: ActionCreator<PayloadAction> = (budget: Partial<ThinBudget>) => {
	return {
		type: BudgetSettingsActions.START_SAVE_BUDGET, payload: { budget },
	};
};

const startCloneBudgets: ActionCreator<PayloadAction> = (budgetIds: string[], startDate: string, endDate: string) => {
	return {
		type: BudgetSettingsActions.START_CLONE_BUDGETS, payload: {
			budgetIds,
			startDate,
			endDate,
		},
	};
};

const setDisplayCurrentOnly: ActionCreator<PayloadAction> = (currentOnly: boolean) => {
	return {
		type: BudgetSettingsActions.SET_DISPLAY_CURRENT_ONLY, payload: { currentOnly },
	};
};

const setBudgetToEdit: ActionCreator<PayloadAction> = (budget: ThinBudget) => {
	return {
		type: BudgetSettingsActions.SET_BUDGET_TO_EDIT, payload: { budget },
	};
};

const setBudgetIdsToClone: ActionCreator<PayloadAction> = (budgets: string[]) => {
	return {
		type: BudgetSettingsActions.SET_BUDGETS_TO_CLONE, payload: { budgets },
	};
};

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => {
	return {
		type: BudgetSettingsActions.SET_EDITOR_BUSY, payload: { editorBusy },
	};
};

export {
	BudgetSettingsActions,
	startDeleteBudget,
	startSaveBudget,
	startCloneBudgets,
	setDisplayCurrentOnly,
	setBudgetToEdit,
	setBudgetIdsToClone,
	setEditorBusy,
};
