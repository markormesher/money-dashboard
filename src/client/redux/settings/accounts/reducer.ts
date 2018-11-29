import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import { PayloadAction } from "../../PayloadAction";
import { AccountSettingsActions } from "./actions";

interface IAccountSettingsState {
	readonly displayActiveOnly: boolean;
	readonly accountToEdit: ThinAccount;
	readonly editorBusy: boolean;
	readonly accountList: ThinAccount[];
	readonly accountListLastLoaded: number;
}

const initialState: IAccountSettingsState = {
	displayActiveOnly: true,
	accountToEdit: undefined,
	editorBusy: false,
	accountList: undefined,
	accountListLastLoaded: -1,
};

function accountSettingsReducer(state = initialState, action: PayloadAction): IAccountSettingsState {
	switch (action.type) {
		case AccountSettingsActions.SET_DISPLAY_ACTIVE_ONLY:
			return {
				...state,
				displayActiveOnly: action.payload.activeOnly,
			};

		case AccountSettingsActions.SET_ACCOUNT_TO_EDIT:
			return {
				...state,
				accountToEdit: action.payload.account,
			};

		case AccountSettingsActions.SET_EDITOR_BUSY:
			return {
				...state,
				editorBusy: action.payload.editorBusy,
			};

		case AccountSettingsActions.SET_ACCOUNT_LIST:
			return {
				...state,
				accountList: action.payload.accountList,
				accountListLastLoaded: action.payload.accountListLoadedAt,
			};

		default:
			return state;
	}
}

export {
	IAccountSettingsState,
	accountSettingsReducer,
};
