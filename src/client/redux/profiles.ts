import axios from "axios";
import { ActionCreator } from "redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { IProfile } from "../../server/models/IProfile";
import { startLoadCurrentUser } from "./auth";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";

interface IProfilesState {
	readonly activeProfile: IProfile;
	readonly profileToEdit: IProfile;
	readonly editorBusy: boolean;
}

const initialState: IProfilesState = {
	activeProfile: undefined,
	profileToEdit: undefined,
	editorBusy: false,
};

enum ProfileActions {
	START_DELETE_PROFILE = "ProfileActions.START_DELETE_PROFILE",
	START_SAVE_PROFILE = "ProfileActions.START_SAVE_PROFILE",
	START_SET_CURRENT_PROFILE = "ProfileActions.START_SET_CURRENT_PROFILE",

	SET_PROFILE_TO_EDIT = "ProfileActions.SET_PROFILE_TO_EDIT",
	SET_EDITOR_BUSY = "ProfileActions.SET_EDITOR_BUSY",
	SET_CURRENT_PROFILE = "ProfileActions.SET_CURRENT_PROFILE",
}

enum ProfileCacheKeys {
	PROFILE_DATA = "ProfileCacheKeys.PROFILE_DATA",
	CURRENT_PROFILE = "ProfileCacheKeys.CURRENT_PROFILE",
}

const startDeleteProfile: ActionCreator<PayloadAction> = (profileId: string) => ({
	type: ProfileActions.START_DELETE_PROFILE,
	payload: { profileId },
});

const startSaveProfile: ActionCreator<PayloadAction> = (profile: Partial<IProfile>) => ({
	type: ProfileActions.START_SAVE_PROFILE,
	payload: { profile },
});

const startSetCurrentProfile: ActionCreator<PayloadAction> = (profile: IProfile) => ({
	type: ProfileActions.START_SET_CURRENT_PROFILE,
	payload: { profile },
});

const setProfileToEdit: ActionCreator<PayloadAction> = (profile: IProfile) => ({
	type: ProfileActions.SET_PROFILE_TO_EDIT,
	payload: { profile },
});

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => ({
	type: ProfileActions.SET_EDITOR_BUSY,
	payload: { editorBusy },
});

const setCurrentProfile: ActionCreator<PayloadAction> = (profile: IProfile) => ({
	type: ProfileActions.SET_CURRENT_PROFILE,
	payload: { profile },
});

function*deleteProfileSaga(): Generator {
	yield takeEvery(ProfileActions.START_DELETE_PROFILE, function*(action: PayloadAction): Generator {
		try {
			yield call(() => axios.post(`/profiles/delete/${action.payload.profileId}`).then((res) => res.data));
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
				call(() => axios.post(`/profiles/edit/${profileId}`, profile)),
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
			yield call(() => axios.post(`/profiles/select/${profile.id}`));
			yield all([
				put(setCurrentProfile(profile)),
				put(startLoadCurrentUser()),
				put(KeyCache.touchKey(ProfileCacheKeys.CURRENT_PROFILE)),
			]);
		} catch (err) {
			yield all([
				put(setError(err)),
				put(KeyCache.touchKey(ProfileCacheKeys.CURRENT_PROFILE)),
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

		case ProfileActions.SET_CURRENT_PROFILE:
			return {
				...state,
				activeProfile: action.payload.profile,
			};

		default:
			return state;
	}
}

export {
	IProfilesState,
	ProfileCacheKeys,
	profilesReducer,
	profilesSagas,
	startDeleteProfile,
	startSaveProfile,
	startSetCurrentProfile,
	setProfileToEdit,
	setEditorBusy,
};
