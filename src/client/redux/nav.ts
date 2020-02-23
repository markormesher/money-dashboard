import { PayloadAction } from "./helpers/PayloadAction";

interface INavState {
  readonly isOpen: boolean; // only matters when nav is in mobile-view
}

const initialState: INavState = {
  isOpen: false,
};

enum NavActions {
  OPEN_NAV = "NavActions.OPEN_NAV",
  CLOSE_NAV = "NavActions.CLOSE_NAV",
}

function openNav(): PayloadAction {
  return {
    type: NavActions.OPEN_NAV,
  };
}

function closeNav(): PayloadAction {
  return {
    type: NavActions.CLOSE_NAV,
  };
}

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

export { INavState, NavActions, navReducer, openNav, closeNav };
