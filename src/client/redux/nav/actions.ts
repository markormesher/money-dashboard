import { ActionCreator } from "redux";
import { PayloadAction } from "../PayloadAction";

class NavActions {
	public static OPEN_NAV = "OPEN_NAV";
	public static CLOSE_NAV = "CLOSE_NAV";
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
