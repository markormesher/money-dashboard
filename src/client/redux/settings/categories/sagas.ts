import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinCategory } from "../../../../server/model-thins/ThinCategory";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { CategorySettingsActions, setCategoryToEdit, setEditorBusy, setLastUpdate } from "./actions";

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

function*saveCategorySaga() {
	yield takeEvery(CategorySettingsActions.START_SAVE_CATEGORY, function*(action: PayloadAction) {
		try {
			const category: Partial<ThinCategory> = action.payload.category;
			const categoryId = category.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/settings/categories/edit/${categoryId}`, category)),
			]);
			yield all([
				put(setLastUpdate()),
				put(setEditorBusy(false)),
				put(setCategoryToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*categorySettingsSagas() {
	yield all([
		deleteCategorySaga(),
		saveCategorySaga(),
	]);
}

export {
	categorySettingsSagas,
};
