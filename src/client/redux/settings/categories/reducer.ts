import { PayloadAction } from "../../PayloadAction";
import { CategorySettingsActions } from "./actions";

interface ICategorySettingsState {
	lastUpdate: number;
}

const initialState: ICategorySettingsState = {
	lastUpdate: 0,
};

function categorySettingsReducer(state = initialState, action: PayloadAction): ICategorySettingsState {
	switch (action.type) {
		case CategorySettingsActions.SET_LAST_UPDATE:
			return {
				...state,
				lastUpdate: action.payload.lastUpdate,
			};

		default:
			return state;
	}
}

export {
	ICategorySettingsState,
	categorySettingsReducer,
};
