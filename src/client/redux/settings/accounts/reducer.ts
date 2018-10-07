import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import { PayloadAction } from "../../PayloadAction";
import { AccountSettingsActions } from "./actions";

interface IAccountSettingsState {
	lastUpdate: number;
	displayActiveOnly: boolean;
	accountToEdit: ThinAccount;
}

const initialState: IAccountSettingsState = {
	lastUpdate: 0,
	displayActiveOnly: true,
	accountToEdit: undefined,
};

function accountSettingsReducer(state = initialState, action: PayloadAction): IAccountSettingsState {
	switch (action.type) {
		case AccountSettingsActions.SET_DISPLAY_ACTIVE_ONLY:
			return {
				...state,
				displayActiveOnly: action.payload.activeOnly,
			};

		case AccountSettingsActions.SET_LAST_UPDATE:
			return {
				...state,
				lastUpdate: action.payload.lastUpdate,
			};

		case AccountSettingsActions.SET_ACCOUNT_TO_EDIT:
			return {
				...state,
				accountToEdit: action.payload.account,
			};

		default:
			return state;
	}
}

export {
	IAccountSettingsState,
	accountSettingsReducer,
};
