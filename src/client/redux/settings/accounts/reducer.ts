import { PayloadAction } from "../../PayloadAction";
import { AccountSettingsActions } from "./actions";

interface IAccountSettingsState {
	lastUpdate: number;
}

const initialState: IAccountSettingsState = {
	lastUpdate: 0,
};

function accountSettingsReducer(state = initialState, action: PayloadAction): IAccountSettingsState {
	switch (action.type) {
		case AccountSettingsActions.SET_LAST_UPDATE:
			return {
				...state,
				lastUpdate: action.payload.lastUpdate,
			};

		default:
			return state;
	}
}

export {
	IAccountSettingsState,
	accountSettingsReducer,
};
