import { PayloadAction } from "../../PayloadAction";
import { BudgetSettingsActions } from "./actions";

interface IBudgetSettingsState {
	lastUpdate: number;
	displayCurrentOnly: boolean;
}

const initialState: IBudgetSettingsState = {
	lastUpdate: 0,
	displayCurrentOnly: true,
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

		default:
			return state;
	}
}

export {
	IBudgetSettingsState,
	budgetSettingsReducer,
};
