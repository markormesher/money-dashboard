import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { ProfileSettingsActions, setLastUpdate } from "./actions";

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

function*profileSettingsSagas() {
	yield all([
		deleteProfileSaga(),
	]);
}

export {
	profileSettingsSagas,
};
