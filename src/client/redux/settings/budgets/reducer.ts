import { PayloadAction } from "../../PayloadAction";
import { BudgetSettingsActions } from "./actions";

interface IBudgetSettingsState {
	lastUpdate: number;
}

const initialState: IBudgetSettingsState = {
	lastUpdate: 0,
};

function budgetSettingsReducer(state = initialState, action: PayloadAction): IBudgetSettingsState {
	switch (action.type) {
		case BudgetSettingsActions.SET_LAST_UPDATE:
			return {
				...state,
				lastUpdate: action.payload.lastUpdate,
			};

		default:
			return state;
	}
}

export {
	IBudgetSettingsState,
	budgetSettingsReducer,
};
