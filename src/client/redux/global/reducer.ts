import { DetailedError } from "../../helpers/errors/DetailedError";
import { PayloadAction } from "../PayloadAction";
import { GlobalActions } from "./actions";

interface IGlobalState {
	readonly waitingFor: string[];
	readonly error?: DetailedError;
	readonly keyShortcutModalVisible?: boolean;
}

const initialState: IGlobalState = {
	waitingFor: [],
	error: undefined,
	keyShortcutModalVisible: false,
};

function globalReducer(state = initialState, action: PayloadAction): IGlobalState {
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

		case GlobalActions.SET_ERROR:
			return {
				...state,
				error: action.payload.error,
			};

		case GlobalActions.SET_KEY_SHORTCUT_MODAL_VISIBLE:
			return {
				...state,
				keyShortcutModalVisible: action.payload.keyShortcutModalVisible,
			};

		default:
			return state;
	}
}

export {
	IGlobalState,
	globalReducer,
};
