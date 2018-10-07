import { ActionCreator } from "redux";
import { DetailedError } from "../../helpers/errors/DetailedError";
import { PayloadAction } from "../PayloadAction";

enum GlobalActions {
	ADD_WAIT = "GlobalActions.ADD_WAIT",
	REMOVE_WAIT = "GlobalActions.REMOVE_WAIT",
	SET_ERROR = "GlobalActions.SET_ERROR",
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

export {
	GlobalActions,
	addWait,
	removeWait,
	setError,
};
