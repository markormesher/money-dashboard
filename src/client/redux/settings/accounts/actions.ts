import { ActionCreator } from "redux";
import { PayloadAction } from "../../PayloadAction";

class AccountSettingsActions {
	public static START_DELETE_ACCOUNT = "START_DELETE_ACCOUNT";
	public static SET_LAST_UPDATE = "SET_LAST_UPDATE";
}

const startDeleteAccount: ActionCreator<PayloadAction> = (accountId: string) => {
	return {
		type: AccountSettingsActions.START_DELETE_ACCOUNT, payload: {
			accountId,
		},
	};
};

const setLastUpdate: ActionCreator<PayloadAction> = () => {
	return {
		type: AccountSettingsActions.SET_LAST_UPDATE, payload: {
			lastUpdate: new Date().getTime(),
		},
	};
};

export {
	AccountSettingsActions,
	startDeleteAccount,
	setLastUpdate,
};
