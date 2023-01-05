import { DetailedError } from "../helpers/errors/DetailedError";
import { PayloadAction } from "./helpers/PayloadAction";

interface IGlobalState {
  readonly error?: DetailedError;
  readonly keyShortcutModalVisible?: boolean;
}

const initialState: IGlobalState = {
  error: undefined,
  keyShortcutModalVisible: false,
};

enum GlobalActions {
  SET_ERROR = "GlobalActions.SET_ERROR",
  SET_KEY_SHORTCUT_MODAL_VISIBLE = "GlobalActions.SET_KEY_SHORTCUT_MODAL_VISIBLE",
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

export { IGlobalState, GlobalActions, globalReducer, setError, setKeyShortcutModalVisible };
