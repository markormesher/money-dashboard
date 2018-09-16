import { AnyAction } from "redux";
import { GlobalActions } from "./actions";

interface IGlobalState {
	waitingFor: string[];
}

const initialState: IGlobalState = {
	waitingFor: [],
};

function globalReducer(state = initialState, action: AnyAction): IGlobalState {
	switch (action.type) {
		case GlobalActions.ADD_WAIT:
			return (() => {
				const wait = action.payload.wait as string;
				return {
					...state,
					waitingFor: state.waitingFor.splice(0).concat(wait),
				};
			})();

		case GlobalActions.REMOVE_WAIT:
			return (() => {
				const wait = action.payload.wait as string;
				return {
					...state,
					waitingFor: state.waitingFor.filter((w) => w !== wait),
				};
			})();

		default:
			return state;
	}
}

export {
	IGlobalState,
	globalReducer,
};
