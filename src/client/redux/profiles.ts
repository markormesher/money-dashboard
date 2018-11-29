import axios from "axios";
import { ActionCreator } from "redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinProfile } from "../../server/model-thins/ThinProfile";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";

interface IProfileSettingsState {
	readonly profileToEdit: ThinProfile;
	readonly editorBusy: boolean;
}

const initialState: IProfileSettingsState = {
	profileToEdit: undefined,
	editorBusy: false,
};

enum ProfileSettingsActions {
	START_DELETE_PROFILE = "ProfileSettingsActions.START_DELETE_PROFILE",
	START_SAVE_PROFILE = "ProfileSettingsActions.START_SAVE_PROFILE",

	SET_PROFILE_TO_EDIT = "ProfileSettingsActions.SET_PROFILE_TO_EDIT",
	SET_EDITOR_BUSY = "ProfileSettingsActions.SET_EDITOR_BUSY",
}

const startDeleteProfile: ActionCreator<PayloadAction> = (profileId: string) => ({
	type: ProfileSettingsActions.START_DELETE_PROFILE,
	payload: { profileId },
});

const startSaveProfile: ActionCreator<PayloadAction> = (profile: Partial<ThinProfile>) => ({
	type: ProfileSettingsActions.START_SAVE_PROFILE,
	payload: { profile },
});

const setProfileToEdit: ActionCreator<PayloadAction> = (profile: ThinProfile) => ({
	type: ProfileSettingsActions.SET_PROFILE_TO_EDIT,
	payload: { profile },
});

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => ({
	type: ProfileSettingsActions.SET_EDITOR_BUSY,
	payload: { editorBusy },
});

function*deleteProfileSaga(): Generator {
	yield takeEvery(ProfileSettingsActions.START_DELETE_PROFILE, function*(action: PayloadAction): Generator {
		try {
			yield call(() => axios.post(`/settings/profiles/delete/${action.payload.profileId}`).then((res) => res.data));
			yield put(KeyCache.touchKey("profiles"));
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*saveProfileSaga(): Generator {
	yield takeEvery(ProfileSettingsActions.START_SAVE_PROFILE, function*(action: PayloadAction): Generator {
		try {
			const profile: Partial<ThinProfile> = action.payload.profile;
			const profileId = profile.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/settings/profiles/edit/${profileId}`, profile)),
			]);
			yield all([
				put(KeyCache.touchKey("profiles")),
				put(setEditorBusy(false)),
				put(setProfileToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*profileSettingsSagas(): Generator {
	yield all([
		deleteProfileSaga(),
		saveProfileSaga(),
	]);
}

function profileSettingsReducer(state = initialState, action: PayloadAction): IProfileSettingsState {
	switch (action.type) {
		case ProfileSettingsActions.SET_PROFILE_TO_EDIT:
			return {
				...state,
				profileToEdit: action.payload.profile,
			};

		case ProfileSettingsActions.SET_EDITOR_BUSY:
			return {
				...state,
				editorBusy: action.payload.editorBusy,
			};

		default:
			return state;
	}
}

export {
	IProfileSettingsState,
	profileSettingsReducer,
	profileSettingsSagas,
	startDeleteProfile,
	startSaveProfile,
	setProfileToEdit,
	setEditorBusy,
};
