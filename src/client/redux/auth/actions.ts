import { ActionCreator } from "redux";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import { PayloadAction } from "../PayloadAction";

enum AuthActions {
	START_LOAD_CURRENT_USER = "AuthActions.START_LOAD_CURRENT_USER",
	START_LOGOUT_CURRENT_USER = "AuthActions.START_LOGOUT_CURRENT_USER",
	SET_CURRENT_USER = "AuthActions.SET_CURRENT_USER",
	UNSET_CURRENT_USER = "AuthActions.UNSET_CURRENT_USER",
}

const startLoadCurrentUser: ActionCreator<PayloadAction> = () => {
	return { type: AuthActions.START_LOAD_CURRENT_USER };
};

const startLogOutCurrentUser: ActionCreator<PayloadAction> = () => {
	return { type: AuthActions.START_LOGOUT_CURRENT_USER };
};

const setCurrentUser: ActionCreator<PayloadAction> = (user: ThinUser) => {
	return {
		type: AuthActions.SET_CURRENT_USER,
		payload: { user },
	};
};

const unsetCurrentUser: ActionCreator<PayloadAction> = () => {
	return { type: AuthActions.UNSET_CURRENT_USER };
};

export {
	AuthActions,
	startLoadCurrentUser,
	startLogOutCurrentUser,
	setCurrentUser,
	unsetCurrentUser,
};
