import { ActionCreator } from "redux";
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

// TODO: avoid flicker by enforcing minimum global wait time? might not be worth it

enum GlobalActions {
	ADD_WAIT = "GlobalActions.ADD_WAIT",
	REMOVE_WAIT = "GlobalActions.REMOVE_WAIT",
	SET_ERROR = "GlobalActions.SET_ERROR",
	SET_KEY_SHORTCUT_MODAL_VISIBLE = "GlobalActions.SET_KEY_SHORTCUT_MODAL_VISIBLE",
}

const addWait: ActionCreator<PayloadAction> = (wait: string) => ({
	type: GlobalActions.ADD_WAIT,
	payload: { wait },
});

const removeWait: ActionCreator<PayloadAction> = (wait: string) => ({
	type: GlobalActions.REMOVE_WAIT,
	payload: { wait },
});

const setError: ActionCreator<PayloadAction> = (error: DetailedError) => ({
	type: GlobalActions.SET_ERROR,
	payload: { error },
});

const setKeyShortcutModalVisible: ActionCreator<PayloadAction> = (keyShortcutModalVisible: boolean) => ({
	type: GlobalActions.SET_KEY_SHORTCUT_MODAL_VISIBLE,
	payload: { keyShortcutModalVisible },
});

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
	addWait,
	removeWait,
	setError,
	setKeyShortcutModalVisible,
};
