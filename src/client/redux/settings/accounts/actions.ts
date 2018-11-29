import { ActionCreator } from "redux";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import { PayloadAction } from "../../PayloadAction";

enum AccountSettingsActions {
	START_DELETE_ACCOUNT = "AccountSettingsActions.START_DELETE_ACCOUNT",
	START_SAVE_ACCOUNT = "AccountSettingsActions.START_SAVE_ACCOUNT",
	START_LOAD_ACCOUNT_LIST = "AccountSettingsActions.START_LOAD_ACCOUNT_LIST",

	SET_DISPLAY_ACTIVE_ONLY = "AccountSettingsActions.SET_DISPLAY_ACTIVE_ONLY",
	SET_ACCOUNT_TO_EDIT = "AccountSettingsActions.SET_ACCOUNT_TO_EDIT",
	SET_EDITOR_BUSY = "AccountSettingsActions.SET_EDITOR_BUSY",
	SET_ACCOUNT_LIST = "AccountSettingsActions.SET_ACCOUNT_LIST",
}

const startDeleteAccount: ActionCreator<PayloadAction> = (accountId: string) => {
	return {
		type: AccountSettingsActions.START_DELETE_ACCOUNT, payload: { accountId },
	};
};

const startSaveAccount: ActionCreator<PayloadAction> = (account: Partial<ThinAccount>) => {
	return {
		type: AccountSettingsActions.START_SAVE_ACCOUNT, payload: { account },
	};
};

const startLoadAccountList: ActionCreator<PayloadAction> = () => {
	return {
		type: AccountSettingsActions.START_LOAD_ACCOUNT_LIST,
	};
};

const setDisplayActiveOnly: ActionCreator<PayloadAction> = (activeOnly: boolean) => {
	return {
		type: AccountSettingsActions.SET_DISPLAY_ACTIVE_ONLY, payload: { activeOnly },
	};
};

const setAccountToEdit: ActionCreator<PayloadAction> = (account: ThinAccount) => {
	return {
		type: AccountSettingsActions.SET_ACCOUNT_TO_EDIT, payload: { account },
	};
};

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => {
	return {
		type: AccountSettingsActions.SET_EDITOR_BUSY, payload: { editorBusy },
	};
};

const setAccountList: ActionCreator<PayloadAction> = (accountList: ThinAccount[]) => {
	return {
		type: AccountSettingsActions.SET_ACCOUNT_LIST, payload: {
			accountList,
			accountListLoadedAt: new Date().getTime(),
		},
	};
};

export {
	AccountSettingsActions,
	startDeleteAccount,
	startSaveAccount,
	startLoadAccountList,
	setDisplayActiveOnly,
	setAccountToEdit,
	setEditorBusy,
	setAccountList,
};
