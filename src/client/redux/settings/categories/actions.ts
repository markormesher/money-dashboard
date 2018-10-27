import { ActionCreator } from "redux";
import { ThinCategory } from "../../../../server/model-thins/ThinCategory";
import { PayloadAction } from "../../PayloadAction";

enum CategorySettingsActions {
	START_DELETE_CATEGORY = "CategorySettingsActions.START_DELETE_CATEGORY",
	START_SAVE_CATEGORY = "CategorySettingsActions.START_SAVE_CATEGORY",
	START_LOAD_CATEGORY_LIST = "CategorySettingsActions.START_LOAD_CATEGORY_LIST",

	SET_LAST_UPDATE = "CategorySettingsActions.SET_LAST_UPDATE",
	SET_CATEGORY_TO_EDIT = "CategorySettingsActions.SET_CATEGORY_TO_EDIT",
	SET_EDITOR_BUSY = "CategorySettingsActions.SET_EDITOR_BUSY",
	SET_CATEGORY_LIST = "CategorySettingsActions.SET_CATEGORY_LIST",
}

const startDeleteCategory: ActionCreator<PayloadAction> = (categoryId: string) => {
	return {
		type: CategorySettingsActions.START_DELETE_CATEGORY, payload: { categoryId },
	};
};

const startSaveCategory: ActionCreator<PayloadAction> = (category: Partial<ThinCategory>) => {
	return {
		type: CategorySettingsActions.START_SAVE_CATEGORY, payload: { category },
	};
};

const startLoadCategoryList: ActionCreator<PayloadAction> = () => {
	return {
		type: CategorySettingsActions.START_LOAD_CATEGORY_LIST,
	};
};

const setLastUpdate: ActionCreator<PayloadAction> = () => {
	return {
		type: CategorySettingsActions.SET_LAST_UPDATE, payload: { lastUpdate: new Date().getTime() },
	};
};

const setCategoryToEdit: ActionCreator<PayloadAction> = (category: ThinCategory) => {
	return {
		type: CategorySettingsActions.SET_CATEGORY_TO_EDIT, payload: { category },
	};
};

const setEditorBusy: ActionCreator<PayloadAction> = (editorBusy: boolean) => {
	return {
		type: CategorySettingsActions.SET_EDITOR_BUSY, payload: { editorBusy },
	};
};

const setCategoryList: ActionCreator<PayloadAction> = (categoryList: ThinCategory[]) => {
	return {
		type: CategorySettingsActions.SET_CATEGORY_LIST, payload: {
			categoryList,
			categoryListLoadedAt: new Date().getTime(),
		},
	};
};

export {
	CategorySettingsActions,
	startDeleteCategory,
	startSaveCategory,
	startLoadCategoryList,
	setLastUpdate,
	setCategoryToEdit,
	setEditorBusy,
	setCategoryList,
};
