import { DetailedError } from "../helpers/errors/DetailedError";
import { PayloadAction } from "./helpers/PayloadAction";

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

enum GlobalActions {
	ADD_WAIT = "GlobalActions.ADD_WAIT",
	REMOVE_WAIT = "GlobalActions.REMOVE_WAIT",
	SET_ERROR = "GlobalActions.SET_ERROR",
	SET_KEY_SHORTCUT_MODAL_VISIBLE = "GlobalActions.SET_KEY_SHORTCUT_MODAL_VISIBLE",
}

function addWait(wait: string): PayloadAction {
	return {
		type: GlobalActions.ADD_WAIT,
		payload: { wait },
	};
}

function removeWait(wait: string): PayloadAction {
	return {
		type: GlobalActions.REMOVE_WAIT,
		payload: { wait },
	};
}

function setError(error: DetailedError): PayloadAction {
	return {
		type: GlobalActions.SET_ERROR,
		payload: { error },
	};
}

function setKeyShortcutModalVisible(keyShortcutModalVisible: boolean): PayloadAction {
	return {
		type: GlobalActions.SET_KEY_SHORTCUT_MODAL_VISIBLE,
		payload: { keyShortcutModalVisible },
	};
}

function globalReducer(state = initialState, action: PayloadAction): IGlobalState {
	switch (action.type) {
		case GlobalActions.ADD_WAIT:
			return (() => {
				const wait = action.payload.wait as string;
				const arrCopy = [...state.waitingFor];
				arrCopy.push(wait);
				return {
					...state,
					waitingFor: arrCopy,
				};
			})();

		case GlobalActions.REMOVE_WAIT:
			return (() => {
				const wait = action.payload.wait as string;
				const idx = state.waitingFor.indexOf(wait);
				if (idx >= 0) {
					const arrCopy = [...state.waitingFor];
					arrCopy.splice(idx, 1);
					return {
						...state,
						waitingFor: arrCopy,
					};
				} else {
					return state;
				}
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
	GlobalActions,
	globalReducer,
	addWait,
	removeWait,
	setError,
	setKeyShortcutModalVisible,
};
