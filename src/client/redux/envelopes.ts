import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { IEnvelope, mapEnvelopeFromApi, mapEnvelopeForApi } from "../../models/IEnvelope";
import { setError } from "./global";
import { PayloadAction } from "./helpers/PayloadAction";
import { ProfileCacheKeys } from "./profiles";

interface IEnvelopesState {
  readonly displayActiveOnly: boolean;
  readonly envelopeToEdit: IEnvelope;
  readonly editorBusy: boolean;
  readonly envelopeList: IEnvelope[];
  readonly envelopeEditsInProgress: IEnvelope[];
}

const initialState: IEnvelopesState = {
  displayActiveOnly: true,
  envelopeToEdit: undefined,
  editorBusy: false,
  envelopeList: undefined,
  envelopeEditsInProgress: [],
};

enum EnvelopeActions {
  START_DELETE_ENVELOPE = "EnvelopeActions.START_DELETE_ENVELOPE",
  START_SAVE_ENVELOPE = "EnvelopeActions.START_SAVE_ENVELOPE",
  START_SET_ENVELOPE_ACTIVE = "EnvelopeActions.START_SET_ENVELOPE_ACTIVE",
  START_LOAD_ENVELOPE_LIST = "EnvelopeActions.START_LOAD_ENVELOPE_LIST",
  SET_DISPLAY_ACTIVE_ONLY = "EnvelopeActions.SET_DISPLAY_ACTIVE_ONLY",
  SET_ENVELOPE_TO_EDIT = "EnvelopeActions.SET_ENVELOPE_TO_EDIT",
  SET_EDITOR_BUSY = "EnvelopeActions.SET_EDITOR_BUSY",
  SET_ENVELOPE_LIST = "EnvelopeActions.SET_ENVELOPE_LIST",
  ADD_ENVELOPE_EDIT_IN_PROGRESS = "EnvelopeActions.ADD_ENVELOPE_EDIT_IN_PROGRESS",
  REMOVE_ENVELOPE_EDIT_IN_PROGRESS = "EnvelopeActions.REMOVE_ENVELOPE_EDIT_IN_PROGRESS",
}

enum EnvelopeCacheKeys {
  ENVELOPE_DATA = "EnvelopeCacheKeys.ENVELOPE_DATA",
  ENVELOPE_LIST = "EnvelopeCacheKeys.ENVELOPE_LIST",
}

// direct call to library method is deliberately not tested
/* istanbul ignore next */
function envelopeListIsCached(): boolean {
  return CacheKeyUtil.keyIsValid(EnvelopeCacheKeys.ENVELOPE_LIST, [
    EnvelopeCacheKeys.ENVELOPE_DATA,
    ProfileCacheKeys.ACTIVE_PROFILE,
  ]);
}

function startDeleteEnvelope(envelope: IEnvelope): PayloadAction {
  return {
    type: EnvelopeActions.START_DELETE_ENVELOPE,
    payload: { envelope },
  };
}

function startSaveEnvelope(envelope: Partial<IEnvelope>): PayloadAction {
  return {
    type: EnvelopeActions.START_SAVE_ENVELOPE,
    payload: { envelope },
  };
}

function startSetEnvelopeActive(envelope: IEnvelope, active: boolean): PayloadAction {
  return {
    type: EnvelopeActions.START_SET_ENVELOPE_ACTIVE,
    payload: { envelope, active },
  };
}

function startLoadEnvelopeList(): PayloadAction {
  return {
    type: EnvelopeActions.START_LOAD_ENVELOPE_LIST,
  };
}

function setDisplayActiveOnly(activeOnly: boolean): PayloadAction {
  return {
    type: EnvelopeActions.SET_DISPLAY_ACTIVE_ONLY,
    payload: { activeOnly },
  };
}

function setEnvelopeToEdit(envelope: IEnvelope): PayloadAction {
  return {
    type: EnvelopeActions.SET_ENVELOPE_TO_EDIT,
    payload: { envelope },
  };
}

function setEditorBusy(editorBusy: boolean): PayloadAction {
  return {
    type: EnvelopeActions.SET_EDITOR_BUSY,
    payload: { editorBusy },
  };
}

function setEnvelopeList(envelopeList: IEnvelope[]): PayloadAction {
  return {
    type: EnvelopeActions.SET_ENVELOPE_LIST,
    payload: { envelopeList },
  };
}

function addEnvelopeEditInProgress(envelope: IEnvelope): PayloadAction {
  return {
    type: EnvelopeActions.ADD_ENVELOPE_EDIT_IN_PROGRESS,
    payload: { envelope },
  };
}

function removeEnvelopeEditInProgress(envelope: IEnvelope): PayloadAction {
  return {
    type: EnvelopeActions.REMOVE_ENVELOPE_EDIT_IN_PROGRESS,
    payload: { envelope },
  };
}

function* deleteEnvelopeSaga(): Generator {
  yield takeEvery(EnvelopeActions.START_DELETE_ENVELOPE, function*(action: PayloadAction): Generator {
    try {
      const envelope: IEnvelope = action.payload.envelope;
      yield call(() => axios.post(`/api/envelopes/delete/${envelope.id}`));
      yield put(CacheKeyUtil.updateKey(EnvelopeCacheKeys.ENVELOPE_DATA));
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* saveEnvelopeSaga(): Generator {
  yield takeEvery(EnvelopeActions.START_SAVE_ENVELOPE, function*(action: PayloadAction): Generator {
    try {
      const envelope: Partial<IEnvelope> = mapEnvelopeForApi(action.payload.envelope);
      const envelopeId = envelope.id || "";
      yield all([put(setEditorBusy(true)), call(() => axios.post(`/api/envelopes/edit/${envelopeId}`, envelope))]);
      yield all([
        put(CacheKeyUtil.updateKey(EnvelopeCacheKeys.ENVELOPE_DATA)),
        put(setEditorBusy(false)),
        put(setEnvelopeToEdit(undefined)),
      ]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* setEnvelopeActiveSaga(): Generator {
  yield takeEvery(EnvelopeActions.START_SET_ENVELOPE_ACTIVE, function*(action: PayloadAction): Generator {
    try {
      const envelope: IEnvelope = action.payload.envelope;
      const active: boolean = action.payload.active;
      const apiRoute = active ? "set-active" : "set-inactive";
      yield all([
        put(addEnvelopeEditInProgress(envelope)),
        call(() => axios.post(`/api/envelopes/${apiRoute}/${envelope.id}`)),
      ]);
      yield all([
        put(CacheKeyUtil.updateKey(EnvelopeCacheKeys.ENVELOPE_DATA)),
        put(removeEnvelopeEditInProgress(envelope)),
      ]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* loadEnvelopeListSaga(): Generator {
  yield takeEvery(EnvelopeActions.START_LOAD_ENVELOPE_LIST, function*(): Generator {
    if (envelopeListIsCached()) {
      return;
    }
    try {
      const envelopeList: IEnvelope[] = (yield call(async () => {
        const res = await axios.get("/api/envelopes/list");
        const raw: IEnvelope[] = res.data;
        return raw.map(mapEnvelopeFromApi);
      })) as IEnvelope[];
      yield all([put(setEnvelopeList(envelopeList)), put(CacheKeyUtil.updateKey(EnvelopeCacheKeys.ENVELOPE_LIST))]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* envelopesSagas(): Generator {
  yield all([deleteEnvelopeSaga(), saveEnvelopeSaga(), setEnvelopeActiveSaga(), loadEnvelopeListSaga()]);
}

function envelopesReducer(state = initialState, action: PayloadAction): IEnvelopesState {
  switch (action.type) {
    case EnvelopeActions.SET_DISPLAY_ACTIVE_ONLY:
      return {
        ...state,
        displayActiveOnly: action.payload.activeOnly,
      };

    case EnvelopeActions.SET_ENVELOPE_TO_EDIT:
      return {
        ...state,
        envelopeToEdit: action.payload.envelope,
      };

    case EnvelopeActions.SET_EDITOR_BUSY:
      return {
        ...state,
        editorBusy: action.payload.editorBusy,
      };

    case EnvelopeActions.SET_ENVELOPE_LIST:
      return {
        ...state,
        envelopeList: action.payload.envelopeList,
      };

    case EnvelopeActions.ADD_ENVELOPE_EDIT_IN_PROGRESS:
      return ((): IEnvelopesState => {
        const envelope = action.payload.envelope as IEnvelope;
        const arrCopy = [...state.envelopeEditsInProgress];
        arrCopy.push(envelope);
        return {
          ...state,
          envelopeEditsInProgress: arrCopy,
        };
      })();

    case EnvelopeActions.REMOVE_ENVELOPE_EDIT_IN_PROGRESS:
      return ((): IEnvelopesState => {
        const envelope = action.payload.envelope as IEnvelope;
        const idx = state.envelopeEditsInProgress.findIndex((a) => a.id === envelope.id);
        if (idx >= 0) {
          const arrCopy = [...state.envelopeEditsInProgress];
          arrCopy.splice(idx, 1);
          return {
            ...state,
            envelopeEditsInProgress: arrCopy,
          };
        } else {
          return state;
        }
      })();

    default:
      return state;
  }
}

export {
  IEnvelopesState,
  EnvelopeActions,
  EnvelopeCacheKeys,
  envelopesReducer,
  envelopesSagas,
  envelopeListIsCached,
  startDeleteEnvelope,
  startSaveEnvelope,
  startSetEnvelopeActive,
  startLoadEnvelopeList,
  setDisplayActiveOnly,
  setEnvelopeToEdit,
  setEditorBusy,
  setEnvelopeList,
  addEnvelopeEditInProgress,
  removeEnvelopeEditInProgress,
};
