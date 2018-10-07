import { ActionCreator } from "redux";
import { PayloadAction } from "../../PayloadAction";

enum BudgetSettingsActions {
	START_DELETE_BUDGET = "BudgetSettingsActions.START_DELETE_BUDGET",
	SET_DISPLAY_CURRENT_ONLY = "BudgetSettingsActions.SET_DISPLAY_CURRENT_ONLY",
	SET_LAST_UPDATE = "BudgetSettingsActions.SET_LAST_UPDATE",
}

const startDeleteBudget: ActionCreator<PayloadAction> = (budgetId: string) => {
	return {
		type: BudgetSettingsActions.START_DELETE_BUDGET, payload: {
			budgetId,
		},
	};
};

const setDisplayCurrentOnly: ActionCreator<PayloadAction> = (currentOnly: boolean) => {
	return {
		type: BudgetSettingsActions.SET_DISPLAY_CURRENT_ONLY, payload: { currentOnly },
	};
};

const setLastUpdate: ActionCreator<PayloadAction> = () => {
	return {
		type: BudgetSettingsActions.SET_LAST_UPDATE, payload: {
			lastUpdate: new Date().getTime(),
		},
	};
};

export {
	BudgetSettingsActions,
	startDeleteBudget,
	setDisplayCurrentOnly,
	setLastUpdate,
};
