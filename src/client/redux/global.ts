import { DetailedError } from "../helpers/errors/DetailedError";
import { PayloadAction } from "./helpers/PayloadAction";

interface IGlobalState {
  readonly error?: DetailedError;
}

const initialState: IGlobalState = {
  error: undefined,
};

enum GlobalActions {
  SET_ERROR = "GlobalActions.SET_ERROR",
}

function setError(error: DetailedError): PayloadAction {
  return {
    type: GlobalActions.SET_ERROR,
    payload: { error },
  };
}

function globalReducer(state = initialState, action: PayloadAction): IGlobalState {
  switch (action.type) {
    case GlobalActions.SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
      };

    default:
      return state;
  }
}

export { IGlobalState, GlobalActions, globalReducer, setError };
