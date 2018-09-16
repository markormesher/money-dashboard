import { Action, ActionCreator } from "redux";

class GlobalActions {
	public static ADD_WAIT = "ADD_WAIT";
	public static REMOVE_WAIT = "REMOVE_WAIT";
}

const addWait: ActionCreator<Action> = (wait: string) => {
	return {
		type: GlobalActions.ADD_WAIT,
		payload: { wait },
	};
};

const removeWait: ActionCreator<Action> = (wait: string) => {
	return {
		type: GlobalActions.REMOVE_WAIT,
		payload: { wait },
	};
};

export {
	GlobalActions,
	addWait,
	removeWait,
};
