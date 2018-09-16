import { Action, ActionCreator } from "redux";
import { ThinUser } from "../../../server/model-thins/ThinUser";

class AuthActions {
	public static START_LOAD_CURRENT_USER = "START_LOAD_CURRENT_USER";
	public static SET_CURRENT_USER = "SET_CURRENT_USER";
	public static UNSET_CURRENT_USER = "UNSET_CURRENT_USER";
	public static START_LOGOUT_CURRENT_USER = "START_LOGOUT_CURRENT_USER";
}

const startLoadCurrentUser: ActionCreator<Action> = () => {
	return { type: AuthActions.START_LOAD_CURRENT_USER };
};

const startLogOutCurrentUser: ActionCreator<Action> = () => {
	return { type: AuthActions.START_LOGOUT_CURRENT_USER };
};

const setCurrentUser: ActionCreator<Action> = (user: ThinUser) => {
	return {
		type: AuthActions.SET_CURRENT_USER,
		payload: { user },
	};
};

const unsetCurrentUser: ActionCreator<Action> = () => {
	return {
		type: AuthActions.UNSET_CURRENT_USER,
	};
};

export {
	AuthActions,
	startLoadCurrentUser,
	startLogOutCurrentUser,
	setCurrentUser,
	unsetCurrentUser,
};
