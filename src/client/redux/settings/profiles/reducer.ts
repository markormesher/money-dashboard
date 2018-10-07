import { PayloadAction } from "../../PayloadAction";
import { ProfileSettingsActions } from "./actions";

interface IProfileSettingsState {
	lastUpdate: number;
}

const initialState: IProfileSettingsState = {
	lastUpdate: 0,
};

function profileSettingsReducer(state = initialState, action: PayloadAction): IProfileSettingsState {
	switch (action.type) {
		case ProfileSettingsActions.SET_LAST_UPDATE:
			return {
				...state,
				lastUpdate: action.payload.lastUpdate,
			};

		default:
			return state;
	}
}

export {
	IProfileSettingsState,
	profileSettingsReducer,
};
