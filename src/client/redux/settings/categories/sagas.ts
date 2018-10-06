import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { CategorySettingsActions, setLastUpdate } from "./actions";

function*deleteCategorySaga() {
	yield takeEvery(CategorySettingsActions.START_DELETE_CATEGORY, function*(action: PayloadAction) {
		try {
			yield call(() => axios.post(`/settings/categories/delete/${action.payload.categoryId}`).then((res) => res.data));
			yield put(setLastUpdate());
		} catch (err) {
			yield put(setError(err));
		}

	});
}

function*categorySettingsSagas() {
	yield all([
		deleteCategorySaga(),
	]);
}

export {
	categorySettingsSagas,
};
