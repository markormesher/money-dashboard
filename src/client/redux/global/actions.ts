import { ActionCreator } from "redux";
import { DetailedError } from "../../helpers/errors/DetailedError";
import { PayloadAction } from "../PayloadAction";

class GlobalActions {
	public static ADD_WAIT = "ADD_WAIT";
	public static REMOVE_WAIT = "REMOVE_WAIT";
	public static SET_ERROR = "SET_ERROR";
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
