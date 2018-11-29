import axios from "axios";
import { ActionCreator } from "redux";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ThinCategory } from "../../server/model-thins/ThinCategory";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";

interface ICategorySettingsState {
	readonly categoryToEdit: ThinCategory;
	readonly editorBusy: boolean;
	readonly categoryList: ThinCategory[];
}

const initialState: ICategorySettingsState = {
	categoryToEdit: undefined,
	editorBusy: false,
	categoryList: undefined,
};

enum CategorySettingsActions {
	START_DELETE_CATEGORY = "CategorySettingsActions.START_DELETE_CATEGORY",
	START_SAVE_CATEGORY = "CategorySettingsActions.START_SAVE_CATEGORY",
	START_LOAD_CATEGORY_LIST = "CategorySettingsActions.START_LOAD_CATEGORY_LIST",

	SET_CATEGORY_TO_EDIT = "CategorySettingsActions.SET_CATEGORY_TO_EDIT",
	SET_EDITOR_BUSY = "CategorySettingsActions.SET_EDITOR_BUSY",
	SET_CATEGORY_LIST = "CategorySettingsActions.SET_CATEGORY_LIST",
}

const startDeleteCategory: ActionCreator<PayloadAction> = (categoryId: string) => ({
	type: CategorySettingsActions.START_DELETE_CATEGORY,
	payload: { categoryId },
});

const startSaveCategory: ActionCreator<PayloadAction> = (category: Partial<ThinCategory>) => ({
	type: CategorySettingsActions.START_SAVE_CATEGORY,
	payload: { category },
});

const startLoadCategoryList: ActionCreator<PayloadAction> = () => ({
	type: CategorySettingsActions.START_LOAD_CATEGORY_LIST,
});

const setCategoryToEdit: ActionCreator<PayloadAction> = (category: ThinCategory) => ({
	type: CategorySettingsActions.SET_CATEGORY_TO_EDIT,
	payload: { category },
});

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => ({
	type: CategorySettingsActions.SET_EDITOR_BUSY,
	payload: { editorBusy },
});

const setCategoryList: ActionCreator<PayloadAction> = (categoryList: ThinCategory[]) => ({
	type: CategorySettingsActions.SET_CATEGORY_LIST,
	payload: {
		categoryList,
		categoryListLoadedAt: new Date().getTime(),
	},
});

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

function categorySettingsReducer(state = initialState, action: PayloadAction): ICategorySettingsState {
	switch (action.type) {
		case CategorySettingsActions.SET_CATEGORY_TO_EDIT:
			return {
				...state,
				categoryToEdit: action.payload.category,
			};

		case CategorySettingsActions.SET_EDITOR_BUSY:
			return {
				...state,
				editorBusy: action.payload.editorBusy,
			};

		case CategorySettingsActions.SET_CATEGORY_LIST:
			return {
				...state,
				categoryList: action.payload.categoryList,
			};

		default:
			return state;
	}
}

export {
	ICategorySettingsState,
	categorySettingsReducer,
	categorySettingsSagas,
	startDeleteCategory,
	startSaveCategory,
	startLoadCategoryList,
	setCategoryToEdit,
	setEditorBusy,
	setCategoryList,
};
