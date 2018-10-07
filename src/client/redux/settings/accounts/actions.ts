import { ActionCreator } from "redux";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import { PayloadAction } from "../../PayloadAction";

// TODO: make these into enums
class AccountSettingsActions {
	public static START_DELETE_ACCOUNT = "START_DELETE_ACCOUNT";
	public static SET_DISPLAY_ACTIVE_ONLY = "SET_DISPLAY_ACTIVE_ONLY";
	public static SET_LAST_UPDATE = "SET_LAST_UPDATE";
	public static SET_ACCOUNT_TO_EDIT = "SET_ACCOUNT_TO_EDIT";
}

const startDeleteAccount: ActionCreator<PayloadAction> = (accountId: string) => {
	return {
		type: AccountSettingsActions.START_DELETE_ACCOUNT, payload: {
			accountId,
		},
	};
};

const setDisplayActiveOnly: ActionCreator<PayloadAction> = (activeOnly: boolean) => {
	return {
		type: AccountSettingsActions.SET_DISPLAY_ACTIVE_ONLY, payload: { activeOnly },
	};
};

const setLastUpdate: ActionCreator<PayloadAction> = () => {
	return {
		type: AccountSettingsActions.SET_LAST_UPDATE, payload: {
			lastUpdate: new Date().getTime(),
		},
	};
};

const setAccountToEdit: ActionCreator<PayloadAction> = (account: ThinAccount) => {
	return {
		type: AccountSettingsActions.SET_ACCOUNT_TO_EDIT, payload: { account },
	};
};

export {
	AccountSettingsActions,
	startDeleteAccount,
	setDisplayActiveOnly,
	setAccountToEdit,
	setLastUpdate,
};
