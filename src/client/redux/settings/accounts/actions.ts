import { ActionCreator } from "redux";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import { PayloadAction } from "../../PayloadAction";

enum AccountSettingsActions {
	START_DELETE_ACCOUNT = "AccountSettingsActions.START_DELETE_ACCOUNT",
	SET_DISPLAY_ACTIVE_ONLY = "AccountSettingsActions.SET_DISPLAY_ACTIVE_ONLY",
	SET_LAST_UPDATE = "AccountSettingsActions.SET_LAST_UPDATE",
	SET_ACCOUNT_TO_EDIT = "AccountSettingsActions.SET_ACCOUNT_TO_EDIT",
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
