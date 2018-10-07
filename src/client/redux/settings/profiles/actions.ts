import { ActionCreator } from "redux";
import { PayloadAction } from "../../PayloadAction";

class ProfileSettingsActions {
	public static START_DELETE_PROFILE = "START_DELETE_PROFILE";
	public static SET_LAST_UPDATE = "SET_LAST_UPDATE";
}

const startDeleteProfile: ActionCreator<PayloadAction> = (profileId: string) => {
	return {
		type: ProfileSettingsActions.START_DELETE_PROFILE, payload: {
			profileId,
		},
	};
};

const setLastUpdate: ActionCreator<PayloadAction> = () => {
	return {
		type: ProfileSettingsActions.SET_LAST_UPDATE, payload: {
			lastUpdate: new Date().getTime(),
		},
	};
};

export {
	ProfileSettingsActions,
	startDeleteProfile,
	setLastUpdate,
};
