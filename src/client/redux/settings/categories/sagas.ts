import axios from "axios";
import { all, call, put, select, takeEvery } from "redux-saga/effects";
import { ThinCategory } from "../../../../server/model-thins/ThinCategory";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { IRootState } from "../../root";
import { CategorySettingsActions, setCategoryList, setCategoryToEdit, setEditorBusy, setLastUpdate } from "./actions";

const lastUpdateSelector = (state: IRootState) => state.settings.categories.lastUpdate;
const lastLoadSelector = (state: IRootState) => state.settings.categories.categoryListLoadedAt;

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

function*loadCategoryListSaga() {
	yield takeEvery(CategorySettingsActions.START_LOAD_CATEGORY_LIST, function*() {
		const lastUpdate = yield select(lastUpdateSelector);
		const lastLoad = yield select(lastLoadSelector);
		if (lastLoad >= lastUpdate) {
			return;
		}
		try {
			const categoryList: ThinCategory[] = yield call(() => {
				return axios.get("/settings/categories/list").then((res) => res.data);
			});
			yield put(setCategoryList(categoryList));
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*categorySettingsSagas() {
	yield all([
		deleteCategorySaga(),
		saveCategorySaga(),
		loadCategoryListSaga(),
	]);
}

export {
	categorySettingsSagas,
};
