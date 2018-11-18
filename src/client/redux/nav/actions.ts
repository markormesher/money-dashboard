import { ActionCreator } from "redux";
import { PayloadAction } from "../PayloadAction";

enum NavActions {
	OPEN_NAV = "NavActions.OPEN_NAV",
	CLOSE_NAV = "NavActions.CLOSE_NAV",
}

const openNav: ActionCreator<PayloadAction> = () => {
	return {
		type: NavActions.OPEN_NAV,
	};
};

const closeNav: ActionCreator<PayloadAction> = () => {
	return {
		type: NavActions.CLOSE_NAV,
	};
};

export {
	NavActions,
	openNav,
	closeNav,
};
