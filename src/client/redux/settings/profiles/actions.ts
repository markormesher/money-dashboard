import { ActionCreator } from "redux";
import { ThinProfile } from "../../../../server/model-thins/ThinProfile";
import { PayloadAction } from "../../PayloadAction";

enum ProfileSettingsActions {
	START_DELETE_PROFILE = "ProfileSettingsActions.START_DELETE_PROFILE",
	START_SAVE_PROFILE = "ProfileSettingsActions.START_SAVE_PROFILE",

	SET_LAST_UPDATE = "ProfileSettingsActions.SET_LAST_UPDATE",
	SET_PROFILE_TO_EDIT = "ProfileSettingsActions.SET_PROFILE_TO_EDIT",
	SET_EDITOR_BUSY = "ProfileSettingsActions.SET_EDITOR_BUSY",
}

const startDeleteProfile: ActionCreator<PayloadAction> = (profileId: string) => {
	return {
		type: ProfileSettingsActions.START_DELETE_PROFILE, payload: {
			profileId,
		},
	};
};

const startSaveProfile: ActionCreator<PayloadAction> = (profile: Partial<ThinProfile>) => {
	return {
		type: ProfileSettingsActions.START_SAVE_PROFILE, payload: { profile },
	};
};

const setLastUpdate: ActionCreator<PayloadAction> = () => {
	return {
		type: ProfileSettingsActions.SET_LAST_UPDATE, payload: {
			lastUpdate: new Date().getTime(),
		},
	};
};

const setProfileToEdit: ActionCreator<PayloadAction> = (profile: ThinProfile) => {
	return {
		type: ProfileSettingsActions.SET_PROFILE_TO_EDIT, payload: { profile },
	};
};

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => {
	return {
		type: ProfileSettingsActions.SET_EDITOR_BUSY, payload: { editorBusy },
	};
};

export {
	ProfileSettingsActions,
	startDeleteProfile,
	startSaveProfile,
	setLastUpdate,
	setProfileToEdit,
	setEditorBusy,
};
