import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import { PayloadAction } from "../../PayloadAction";
import { AccountSettingsActions } from "./actions";

interface IAccountSettingsState {
	accountList: ThinAccount[];
}

const initialState: IAccountSettingsState = {
	accountList: undefined,
};

function accountSettingsReducer(state = initialState, action: PayloadAction): IAccountSettingsState {
	switch (action.type) {
		case AccountSettingsActions.SET_ACCOUNT_LIST:
			return {
				...state,
				accountList: action.payload.accounts,
			};

		default:
			return state;
	}
}

export {
	IAccountSettingsState,
	accountSettingsReducer,
};
