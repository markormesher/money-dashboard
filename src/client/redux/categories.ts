import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { ICategory, mapCategoryFromApi } from "../../models/ICategory";
import { setError } from "./global";
import { PayloadAction } from "./helpers/PayloadAction";

interface ICategoriesState {
  readonly categoryList: ICategory[];
}

const initialState: ICategoriesState = {
  categoryList: undefined,
};

enum CategoryActions {
  START_LOAD_CATEGORY_LIST = "CategoryActions.START_LOAD_CATEGORY_LIST",

  SET_CATEGORY_LIST = "CategoryActions.SET_CATEGORY_LIST",
}

enum CategoryCacheKeys {
  CATEGORY_DATA = "CategoryCacheKeys.CATEGORY_DATA",
  CATEGORY_LIST = "CategoryCacheKeys.CATEGORY_LIST",
}

function startLoadCategoryList(): PayloadAction {
  return {
    type: CategoryActions.START_LOAD_CATEGORY_LIST,
  };
}

function setCategoryList(categoryList: ICategory[]): PayloadAction {
  return {
    type: CategoryActions.SET_CATEGORY_LIST,
    payload: { categoryList },
  };
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
  yield all([loadCategoryListSaga()]);
}

function categoriesReducer(state = initialState, action: PayloadAction): ICategoriesState {
  switch (action.type) {
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
  startLoadCategoryList,
  setCategoryList,
};
