import { ActionCreator } from "redux";
import { PayloadAction } from "../../PayloadAction";

class BudgetSettingsActions {
	public static START_DELETE_BUDGET = "START_DELETE_BUDGET";
	public static SET_LAST_UPDATE = "SET_LAST_UPDATE";
}

const startDeleteBudget: ActionCreator<PayloadAction> = (budgetId: string) => {
	return {
		type: BudgetSettingsActions.START_DELETE_BUDGET, payload: {
			budgetId,
		},
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
	setLastUpdate,
};
