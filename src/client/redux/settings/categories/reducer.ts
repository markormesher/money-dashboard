import { ThinCategory } from "../../../../server/model-thins/ThinCategory";
import { PayloadAction } from "../../PayloadAction";
import { CategorySettingsActions } from "./actions";

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
};
