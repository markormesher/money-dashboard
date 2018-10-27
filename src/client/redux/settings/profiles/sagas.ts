import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinProfile } from "../../../../server/model-thins/ThinProfile";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { ProfileSettingsActions, setEditorBusy, setLastUpdate, setProfileToEdit } from "./actions";

function*deleteProfileSaga() {
	yield takeEvery(ProfileSettingsActions.START_DELETE_PROFILE, function*(action: PayloadAction) {
		try {
			yield call(() => axios.post(`/settings/profiles/delete/${action.payload.profileId}`).then((res) => res.data));
			yield put(setLastUpdate());
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*saveProfileSaga() {
	yield takeEvery(ProfileSettingsActions.START_SAVE_PROFILE, function*(action: PayloadAction) {
		try {
			const profile: Partial<ThinProfile> = action.payload.profile;
			const profileId = profile.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/settings/profiles/edit/${profileId}`, profile)),
			]);
			yield all([
				put(setLastUpdate()),
				put(setEditorBusy(false)),
				put(setProfileToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*profileSettingsSagas() {
	yield all([
		deleteProfileSaga(),
		saveProfileSaga(),
	]);
}

export {
	profileSettingsSagas,
};
