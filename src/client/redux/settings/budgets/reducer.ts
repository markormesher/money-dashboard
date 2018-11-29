import { ThinBudget } from "../../../../server/model-thins/ThinBudget";
import { PayloadAction } from "../../PayloadAction";
import { BudgetSettingsActions } from "./actions";

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
};
