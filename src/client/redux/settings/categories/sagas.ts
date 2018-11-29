import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinCategory } from "../../../../server/model-thins/ThinCategory";
import { KeyCache } from "../../caching/key-cache";
import { setError } from "../../global/actions";
import { PayloadAction } from "../../PayloadAction";
import { CategorySettingsActions, setCategoryList, setCategoryToEdit, setEditorBusy } from "./actions";

function*deleteCategorySaga(): Generator {
	yield takeEvery(CategorySettingsActions.START_DELETE_CATEGORY, function*(action: PayloadAction): Generator {
		try {
			yield call(() => axios.post(`/settings/categories/delete/${action.payload.categoryId}`).then((res) => res.data));
			yield put(KeyCache.touchKey("categories"));
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*saveCategorySaga(): Generator {
	yield takeEvery(CategorySettingsActions.START_SAVE_CATEGORY, function*(action: PayloadAction): Generator {
		try {
			const category: Partial<ThinCategory> = action.payload.category;
			const categoryId = category.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/settings/categories/edit/${categoryId}`, category)),
			]);
			yield all([
				put(KeyCache.touchKey("categories")),
				put(setEditorBusy(false)),
				put(setCategoryToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*loadCategoryListSaga(): Generator {
	yield takeEvery(CategorySettingsActions.START_LOAD_CATEGORY_LIST, function*(): Generator {
		if (KeyCache.keyIsValid("category-list", ["categories"])) {
			return;
		}
		try {
			const categoryList: ThinCategory[] = yield call(() => {
				return axios.get("/settings/categories/list").then((res) => res.data);
			});
			yield all([
				put(setCategoryList(categoryList)),
				put(KeyCache.touchKey("category-list")),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*categorySettingsSagas(): Generator {
	yield all([
		deleteCategorySaga(),
		saveCategorySaga(),
		loadCategoryListSaga(),
	]);
}

export {
	categorySettingsSagas,
};
