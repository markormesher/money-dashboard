import { ActionCreator } from "redux";
import { PayloadAction } from "../../PayloadAction";

enum ProfileSettingsActions {
	START_DELETE_PROFILE = "ProfileSettingsActions.START_DELETE_PROFILE",
	SET_LAST_UPDATE = "ProfileSettingsActions.SET_LAST_UPDATE",
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
