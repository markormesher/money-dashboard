import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { ICategory, mapCategoryFromApi, mapCategoryForApi } from "../../models/ICategory";
import { setError } from "./global";
import { PayloadAction } from "./helpers/PayloadAction";

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

function startDeleteCategory(category: ICategory): PayloadAction {
  return {
    type: CategoryActions.START_DELETE_CATEGORY,
    payload: { category },
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
    payload: { categoryList },
  };
}

function* deleteCategorySaga(): Generator {
  yield takeEvery(CategoryActions.START_DELETE_CATEGORY, function* (action: PayloadAction): Generator {
    try {
      const category: ICategory = action.payload.category;
      yield call(() => axios.post(`/api/categories/delete/${category.id}`).then((res) => res.data));
      yield put(CacheKeyUtil.updateKey(CategoryCacheKeys.CATEGORY_DATA));
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* saveCategorySaga(): Generator {
  yield takeEvery(CategoryActions.START_SAVE_CATEGORY, function* (action: PayloadAction): Generator {
    try {
      const category: Partial<ICategory> = mapCategoryForApi(action.payload.category);
      const categoryId = category.id || "";
      yield all([put(setEditorBusy(true)), call(() => axios.post(`/api/categories/edit/${categoryId}`, category))]);
      yield all([
        put(CacheKeyUtil.updateKey(CategoryCacheKeys.CATEGORY_DATA)),
        put(setEditorBusy(false)),
        put(setCategoryToEdit(undefined)),
      ]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* loadCategoryListSaga(): Generator {
  yield takeEvery(CategoryActions.START_LOAD_CATEGORY_LIST, function* (): Generator {
    if (CacheKeyUtil.keyIsValid(CategoryCacheKeys.CATEGORY_LIST, [CategoryCacheKeys.CATEGORY_DATA])) {
      return;
    }
    try {
      const categoryList: ICategory[] = (yield call(async () => {
        const res = await axios.get("/api/categories/list");
        const raw: ICategory[] = res.data;
        return raw.map(mapCategoryFromApi);
      })) as ICategory[];
      yield all([put(setCategoryList(categoryList)), put(CacheKeyUtil.updateKey(CategoryCacheKeys.CATEGORY_LIST))]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* categoriesSagas(): Generator {
  yield all([deleteCategorySaga(), saveCategorySaga(), loadCategoryListSaga()]);
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
  CategoryActions,
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
