import { ActionCreator } from "redux";
import { ThinBudget } from "../../../../server/model-thins/ThinBudget";
import { PayloadAction } from "../../PayloadAction";

enum BudgetSettingsActions {
	START_DELETE_BUDGET = "BudgetSettingsActions.START_DELETE_BUDGET",
	START_SAVE_BUDGET = "BudgetSettingsActions.START_SAVE_BUDGET",

	SET_DISPLAY_CURRENT_ONLY = "BudgetSettingsActions.SET_DISPLAY_CURRENT_ONLY",
	SET_LAST_UPDATE = "BudgetSettingsActions.SET_LAST_UPDATE",
	SET_BUDGET_TO_EDIT = "BudgetSettingsActions.SET_BUDGET_TO_EDIT",
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

const setDisplayCurrentOnly: ActionCreator<PayloadAction> = (currentOnly: boolean) => {
	return {
		type: BudgetSettingsActions.SET_DISPLAY_CURRENT_ONLY, payload: { currentOnly },
	};
};

const setLastUpdate: ActionCreator<PayloadAction> = () => {
	return {
		type: BudgetSettingsActions.SET_LAST_UPDATE, payload: { lastUpdate: new Date().getTime() },
	};
};

const setBudgetToEdit: ActionCreator<PayloadAction> = (budget: ThinBudget) => {
	return {
		type: BudgetSettingsActions.SET_BUDGET_TO_EDIT, payload: { budget },
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
	setDisplayCurrentOnly,
	setLastUpdate,
	setBudgetToEdit,
	setEditorBusy,
};
