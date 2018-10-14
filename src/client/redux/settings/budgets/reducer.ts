import { ThinBudget } from "../../../../server/model-thins/ThinBudget";
import { PayloadAction } from "../../PayloadAction";
import { BudgetSettingsActions } from "./actions";

interface IBudgetSettingsState {
	lastUpdate: number;
	displayCurrentOnly: boolean;
	budgetToEdit: ThinBudget;
	editorBusy: boolean;
}

const initialState: IBudgetSettingsState = {
	lastUpdate: 0,
	displayCurrentOnly: true,
	budgetToEdit: undefined,
	editorBusy: false,
};

function budgetSettingsReducer(state = initialState, action: PayloadAction): IBudgetSettingsState {
	switch (action.type) {
		case BudgetSettingsActions.SET_LAST_UPDATE:
			return {
				...state,
				lastUpdate: action.payload.lastUpdate,
			};

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
