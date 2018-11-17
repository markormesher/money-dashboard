import { ActionCreator } from "redux";
import { DetailedError } from "../../helpers/errors/DetailedError";
import { PayloadAction } from "../PayloadAction";

enum GlobalActions {
	ADD_WAIT = "GlobalActions.ADD_WAIT",
	REMOVE_WAIT = "GlobalActions.REMOVE_WAIT",
	SET_ERROR = "GlobalActions.SET_ERROR",
	SET_KEY_SHORTCUT_MODAL_VISIBLE = "GlobalActions.SET_KEY_SHORTCUT_MODAL_VISIBLE",
}

const addWait: ActionCreator<PayloadAction> = (wait: string) => {
	return {
		type: GlobalActions.ADD_WAIT,
		payload: { wait },
	};
};

const removeWait: ActionCreator<PayloadAction> = (wait: string) => {
	return {
		type: GlobalActions.REMOVE_WAIT,
		payload: { wait },
	};
};

const setError: ActionCreator<PayloadAction> = (error: DetailedError) => {
	return {
		type: GlobalActions.SET_ERROR,
		payload: { error },
	};
};

const setKeyShortcutModalVisible: ActionCreator<PayloadAction> = (keyShortcutModalVisible: boolean) => {
	return {
		type: GlobalActions.SET_KEY_SHORTCUT_MODAL_VISIBLE,
		payload: { keyShortcutModalVisible },
	};
};

export {
	GlobalActions,
	addWait,
	removeWait,
	setError,
	setKeyShortcutModalVisible,
};
