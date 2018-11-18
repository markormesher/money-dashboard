import { ThinUser } from "../../../server/model-thins/ThinUser";
import { PayloadAction } from "../PayloadAction";
import { AuthActions } from "./actions";

interface IAuthState {
	readonly activeUser?: ThinUser;
	readonly activeProfile?: number;
}

const initialState: IAuthState = {
	activeUser: undefined,
	activeProfile: undefined,
};

function authReducer(state = initialState, action: PayloadAction): IAuthState {
	switch (action.type) {
		case AuthActions.SET_CURRENT_USER:
			return {
				...state,
				activeUser: action.payload.user,
				activeProfile: 0,
			};

		case AuthActions.UNSET_CURRENT_USER:
			return {
				...state,
				activeUser: undefined,
				activeProfile: undefined,
			};

		default:
			return state;
	}
}

export {
	IAuthState,
	authReducer,
};
