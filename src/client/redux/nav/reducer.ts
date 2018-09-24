import { PayloadAction } from "../PayloadAction";
import { NavActions } from "./actions";

interface INavState {
	isOpen: boolean; // only matters when nav is in mobile-view
}

const initialState: INavState = {
	isOpen: false,
};

function navReducer(state = initialState, action: PayloadAction): INavState {
	switch (action.type) {
		case NavActions.OPEN_NAV:
			return {
				...state,
				isOpen: true,
			};

		case NavActions.CLOSE_NAV:
			return {
				...state,
				isOpen: false,
			};

		default:
			return state;
	}
}

export {
	INavState,
	navReducer,
};
