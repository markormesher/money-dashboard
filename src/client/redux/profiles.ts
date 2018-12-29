import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { IProfile } from "../../commons/models/IProfile";
import { startLoadCurrentUser } from "./auth";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";

interface IProfilesState {
	readonly activeProfile: IProfile;
	readonly profileToEdit: IProfile;
	readonly editorBusy: boolean;
	readonly profileSwitchInProgress: boolean;
}

const initialState: IProfilesState = {
	activeProfile: undefined,
	profileToEdit: undefined,
	editorBusy: false,
	profileSwitchInProgress: false,
};

enum ProfileActions {
	START_DELETE_PROFILE = "ProfileActions.START_DELETE_PROFILE",
	START_SAVE_PROFILE = "ProfileActions.START_SAVE_PROFILE",
	START_SET_CURRENT_PROFILE = "ProfileActions.START_SET_CURRENT_PROFILE",

	SET_PROFILE_TO_EDIT = "ProfileActions.SET_PROFILE_TO_EDIT",
	SET_EDITOR_BUSY = "ProfileActions.SET_EDITOR_BUSY",
	SET_ACTIVE_PROFILE = "ProfileActions.SET_ACTIVE_PROFILE",
	SET_PROFILE_SWITCH_IN_PROGRESS = "ProfileActions.SET_PROFILE_SWITCH_IN_PROGRESS",
}

enum ProfileCacheKeys {
	PROFILE_DATA = "ProfileCacheKeys.PROFILE_DATA",
	CURRENT_PROFILE = "ProfileCacheKeys.CURRENT_PROFILE",
}

function startDeleteProfile(profile: IProfile): PayloadAction {
	return {
		type: ProfileActions.START_DELETE_PROFILE,
		payload: { profile },
	};
}

function startSaveProfile(profile: Partial<IProfile>): PayloadAction {
	return {
		type: ProfileActions.START_SAVE_PROFILE,
		payload: { profile },
	};
}

function startSetCurrentProfile(profile: IProfile): PayloadAction {
	return {
		type: ProfileActions.START_SET_CURRENT_PROFILE,
		payload: { profile },
	};
}

function setProfileToEdit(profile: IProfile): PayloadAction {
	return {
		type: ProfileActions.SET_PROFILE_TO_EDIT,
		payload: { profile },
	};
}

function setEditorBusy(editorBusy: boolean): PayloadAction {
	return {
		type: ProfileActions.SET_EDITOR_BUSY,
		payload: { editorBusy },
	};
}

function setActiveProfile(profile: IProfile): PayloadAction {
	return {
		type: ProfileActions.SET_ACTIVE_PROFILE,
		payload: { profile },
	};
}

function setProfileSwitchInProgress(profileSwitchInProgress: boolean): PayloadAction {
	return {
		type: ProfileActions.SET_PROFILE_SWITCH_IN_PROGRESS,
		payload: { profileSwitchInProgress },
	};
}

function*deleteProfileSaga(): Generator {
	yield takeEvery(ProfileActions.START_DELETE_PROFILE, function*(action: PayloadAction): Generator {
		try {
			const profile: IProfile = action.payload.profile;
			yield call(() => axios.post(`/api/profiles/delete/${profile.id}`).then((res) => res.data));
			yield put(KeyCache.touchKey(ProfileCacheKeys.PROFILE_DATA));
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*saveProfileSaga(): Generator {
	yield takeEvery(ProfileActions.START_SAVE_PROFILE, function*(action: PayloadAction): Generator {
		try {
			const profile: Partial<IProfile> = action.payload.profile;
			const profileId = profile.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/api/profiles/edit/${profileId}`, profile)),
			]);
			yield all([
				put(KeyCache.touchKey(ProfileCacheKeys.PROFILE_DATA)),
				put(setEditorBusy(false)),
				put(setProfileToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*setCurrentProfileSaga(): Generator {
	yield takeEvery(ProfileActions.START_SET_CURRENT_PROFILE, function*(action: PayloadAction): Generator {
		try {
			const profile: IProfile = action.payload.profile;
			put(setProfileSwitchInProgress(true));
			yield call(() => axios.post(`/api/profiles/select/${profile.id}`));
			yield all([
				put(setActiveProfile(profile)),
				put(startLoadCurrentUser()),
				put(KeyCache.touchKey(ProfileCacheKeys.CURRENT_PROFILE)),
				put(setProfileSwitchInProgress(false)),
			]);
		} catch (err) {
			yield all([
				put(setError(err)),
				put(KeyCache.touchKey(ProfileCacheKeys.CURRENT_PROFILE)),
				put(setProfileSwitchInProgress(false)),
			]);
		}
	});
}

function*profilesSagas(): Generator {
	yield all([
		deleteProfileSaga(),
		saveProfileSaga(),
		setCurrentProfileSaga(),
	]);
}

function profilesReducer(state = initialState, action: PayloadAction): IProfilesState {
	switch (action.type) {
		case ProfileActions.SET_PROFILE_TO_EDIT:
			return {
				...state,
				profileToEdit: action.payload.profile,
			};

		case ProfileActions.SET_EDITOR_BUSY:
			return {
				...state,
				editorBusy: action.payload.editorBusy,
			};

		case ProfileActions.SET_ACTIVE_PROFILE:
			return {
				...state,
				activeProfile: action.payload.profile,
			};

		case ProfileActions.SET_PROFILE_SWITCH_IN_PROGRESS:
			return {
				...state,
				profileSwitchInProgress: action.payload.profileSwitchInProgress,
			};

		default:
			return state;
	}
}

export {
	IProfilesState,
	ProfileActions,
	ProfileCacheKeys,
	profilesReducer,
	profilesSagas,
	startDeleteProfile,
	startSaveProfile,
	startSetCurrentProfile,
	setProfileToEdit,
	setEditorBusy,
	setActiveProfile,
	setProfileSwitchInProgress,
};
