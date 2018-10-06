import { ActionCreator } from "redux";
import { PayloadAction } from "../../PayloadAction";

class CategorySettingsActions {
		public static START_DELETE_CATEGORY = "START_DELETE_CATEGORY";
	public static SET_LAST_UPDATE = "SET_LAST_UPDATE";
}

const startDeleteCategory: ActionCreator<PayloadAction> = (categoryId: string) => {
	return {
		type: CategorySettingsActions.START_DELETE_CATEGORY, payload: {
			categoryId,
		},
	};
};

const setLastUpdate: ActionCreator<PayloadAction> = () => {
	return {
		type: CategorySettingsActions.SET_LAST_UPDATE, payload: {
			lastUpdate: new Date().getTime(),
		},
	};
};

export {
	CategorySettingsActions,
	startDeleteCategory,
	setLastUpdate,
};
