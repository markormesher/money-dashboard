import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ICategory, mapCategoryFromApi } from "../../server/models/ICategory";
import { setError } from "./global";
import { KeyCache } from "./helpers/KeyCache";
import { PayloadAction } from "./helpers/PayloadAction";
import { ProfileCacheKeys } from "./profiles";

interface ICategoriesState {
	readonly categoryToEdit: ICategory;
	readonly editorBusy: boolean;
	readonly categoryList: ICategory[];
}

const initialState: ICategoriesState = {
	categoryToEdit: undefined,
	editorBusy: false,
	categoryList: undefined,
};

enum CategoryActions {
	START_DELETE_CATEGORY = "CategoryActions.START_DELETE_CATEGORY",
	START_SAVE_CATEGORY = "CategoryActions.START_SAVE_CATEGORY",
	START_LOAD_CATEGORY_LIST = "CategoryActions.START_LOAD_CATEGORY_LIST",

	SET_CATEGORY_TO_EDIT = "CategoryActions.SET_CATEGORY_TO_EDIT",
	SET_EDITOR_BUSY = "CategoryActions.SET_EDITOR_BUSY",
	SET_CATEGORY_LIST = "CategoryActions.SET_CATEGORY_LIST",
}

enum CategoryCacheKeys {
	CATEGORY_DATA = "CategoryCacheKeys.CATEGORY_DATA",
	CATEGORY_LIST = "CategoryCacheKeys.CATEGORY_LIST",
}

function startDeleteCategory(categoryId: string): PayloadAction {
	return {
		type: CategoryActions.START_DELETE_CATEGORY,
		payload: { categoryId },
	};
}

function startSaveCategory(category: Partial<ICategory>): PayloadAction {
	return {
		type: CategoryActions.START_SAVE_CATEGORY,
		payload: { category },
	};
}

function startLoadCategoryList(): PayloadAction {
	return {
		type: CategoryActions.START_LOAD_CATEGORY_LIST,
	};
}

function setCategoryToEdit(category: ICategory): PayloadAction {
	return {
		type: CategoryActions.SET_CATEGORY_TO_EDIT,
		payload: { category },
	};
}

function setEditorBusy(editorBusy: boolean): PayloadAction {
	return {
		type: CategoryActions.SET_EDITOR_BUSY,
		payload: { editorBusy },
	};
}

function setCategoryList(categoryList: ICategory[]): PayloadAction {
	return {
		type: CategoryActions.SET_CATEGORY_LIST,
		payload: {
			categoryList,
			categoryListLoadedAt: new Date().getTime(),
		},
	};
}

function*deleteCategorySaga(): Generator {
	yield takeEvery(CategoryActions.START_DELETE_CATEGORY, function*(action: PayloadAction): Generator {
		try {
			yield call(() => axios.post(`/categories/delete/${action.payload.categoryId}`).then((res) => res.data));
			yield put(KeyCache.touchKey(CategoryCacheKeys.CATEGORY_DATA));
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*saveCategorySaga(): Generator {
	yield takeEvery(CategoryActions.START_SAVE_CATEGORY, function*(action: PayloadAction): Generator {
		try {
			const category: Partial<ICategory> = action.payload.category;
			const categoryId = category.id || "";
			yield all([
				put(setEditorBusy(true)),
				call(() => axios.post(`/categories/edit/${categoryId}`, category)),
			]);
			yield all([
				put(KeyCache.touchKey(CategoryCacheKeys.CATEGORY_DATA)),
				put(setEditorBusy(false)),
				put(setCategoryToEdit(undefined)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*loadCategoryListSaga(): Generator {
	yield takeEvery(CategoryActions.START_LOAD_CATEGORY_LIST, function*(): Generator {
		if (KeyCache.keyIsValid(CategoryCacheKeys.CATEGORY_LIST, [
			CategoryCacheKeys.CATEGORY_DATA,
			ProfileCacheKeys.CURRENT_PROFILE,
		])) {
			return;
		}
		try {
			const categoryList: ICategory[] = yield call(() => {
				return axios.get("/categories/list")
						.then((res) => {
							const raw: ICategory[] = res.data;
							return raw.map(mapCategoryFromApi);
						});
			});
			yield all([
				put(setCategoryList(categoryList)),
				put(KeyCache.touchKey(CategoryCacheKeys.CATEGORY_LIST)),
			]);
		} catch (err) {
			yield put(setError(err));
		}
	});
}

function*categoriesSagas(): Generator {
	yield all([
		deleteCategorySaga(),
		saveCategorySaga(),
		loadCategoryListSaga(),
	]);
}

function categoriesReducer(state = initialState, action: PayloadAction): ICategoriesState {
	switch (action.type) {
		case CategoryActions.SET_CATEGORY_TO_EDIT:
			return {
				...state,
				categoryToEdit: action.payload.category,
			};

		case CategoryActions.SET_EDITOR_BUSY:
			return {
				...state,
				editorBusy: action.payload.editorBusy,
			};

		case CategoryActions.SET_CATEGORY_LIST:
			return {
				...state,
				categoryList: action.payload.categoryList,
			};

		default:
			return state;
	}
}

export {
	ICategoriesState,
	CategoryCacheKeys,
	categoriesReducer,
	categoriesSagas,
	startDeleteCategory,
	startSaveCategory,
	startLoadCategoryList,
	setCategoryToEdit,
	setEditorBusy,
	setCategoryList,
};
