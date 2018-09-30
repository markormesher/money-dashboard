import { ActionCreator } from "redux";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import { PayloadAction } from "../../PayloadAction";

class AccountSettingsActions {
	public static START_LOAD_ACCOUNT_LIST = "START_LOAD_ACCOUNT_LIST";
	public static SET_ACCOUNT_LIST = "SET_ACCOUNT_LIST";
	public static UNSET_ACCOUNT_LIST = "UNSET_ACCOUNT_LIST";
}

const startLoadAccountList: ActionCreator<PayloadAction> = () => {
	return { type: AccountSettingsActions.START_LOAD_ACCOUNT_LIST };
};

const setAccountList: ActionCreator<PayloadAction> = (accounts: ThinAccount[]) => {
	return {
		type: AccountSettingsActions.SET_ACCOUNT_LIST,
		payload: { accounts },
	};
};

const unsetAccountList: ActionCreator<PayloadAction> = () => {
	return { type: AccountSettingsActions.UNSET_ACCOUNT_LIST };
};

export {
	AccountSettingsActions,
	startLoadAccountList,
	setAccountList,
	unsetAccountList,
};
