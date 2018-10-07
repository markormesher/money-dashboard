import { ActionCreator } from "redux";
import { PayloadAction } from "../../PayloadAction";

class BudgetSettingsActions {
	public static START_DELETE_BUDGET = "START_DELETE_BUDGET";
	public static SET_DISPLAY_CURRENT_ONLY = "SET_DISPLAY_CURRENT_ONLY";
	public static SET_LAST_UPDATE = "SET_LAST_UPDATE";
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
