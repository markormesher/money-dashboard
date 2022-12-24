import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { IEnvelope, mapEnvelopeFromApi, mapEnvelopeForApi } from "../../models/IEnvelope";
import {
  IEnvelopeAllocation,
  mapEnvelopeAllocationFromApi,
  mapEnvelopeAllocationForApi,
} from "../../models/IEnvelopeAllocation";
import { setError } from "./global";
import { PayloadAction } from "./helpers/PayloadAction";
import { ProfileCacheKeys } from "./profiles";

interface IEnvelopesState {
  readonly envelopeToEdit: IEnvelope;
  readonly envelopeEditorBusy: boolean;
  readonly envelopeList: IEnvelope[];
  readonly envelopeEditsInProgress: IEnvelope[];

  readonly displayActiveAllocationsOnly: boolean;
  readonly allocationToEdit: IEnvelopeAllocation;
  readonly allocationEditorBusy: boolean;
  readonly allocationList: IEnvelopeAllocation[];
  readonly allocationEditsInProgress: IEnvelopeAllocation[];
}

const initialState: IEnvelopesState = {
  envelopeToEdit: undefined,
  envelopeEditorBusy: false,
  envelopeList: undefined,
  envelopeEditsInProgress: [],

  displayActiveAllocationsOnly: true,
  allocationToEdit: undefined,
  allocationEditorBusy: false,
  allocationList: undefined,
  allocationEditsInProgress: [],
};

enum EnvelopeActions {
  START_DELETE_ENVELOPE = "EnvelopeActions.START_DELETE_ENVELOPE",
  START_SAVE_ENVELOPE = "EnvelopeActions.START_SAVE_ENVELOPE",
  START_LOAD_ENVELOPE_LIST = "EnvelopeActions.START_LOAD_ENVELOPE_LIST",
  SET_ENVELOPE_TO_EDIT = "EnvelopeActions.SET_ENVELOPE_TO_EDIT",
  SET_ENVELOPE_EDITOR_BUSY = "EnvelopeActions.SET_ENVELOPE_EDITOR_BUSY",
  SET_ENVELOPE_LIST = "EnvelopeActions.SET_ENVELOPE_LIST",
  ADD_ENVELOPE_EDIT_IN_PROGRESS = "EnvelopeActions.ADD_ENVELOPE_EDIT_IN_PROGRESS",
  REMOVE_ENVELOPE_EDIT_IN_PROGRESS = "EnvelopeActions.REMOVE_ENVELOPE_EDIT_IN_PROGRESS",

  START_DELETE_ALLOCATION = "EnvelopeActions.START_DELETE_ALLOCATION",
  START_SAVE_ALLOCATION = "EnvelopeActions.START_SAVE_ALLOCATION",
  START_LOAD_ALLOCATION_LIST = "EnvelopeActions.START_LOAD_ALLOCATION_LIST",
  SET_DISPLAY_ACTIVE_ALLOCATIONS_ONLY = "EnvelopeActions.SET_DISPLAY_ACTIVE_ALLOCATIONS_ONLY",
  SET_ALLOCATION_TO_EDIT = "EnvelopeActions.SET_ALLOCATION_TO_EDIT",
  SET_ALLOCATION_EDITOR_BUSY = "EnvelopeActions.SET_ALLOCATION_EDITOR_BUSY",
  SET_ALLOCATION_LIST = "EnvelopeActions.SET_ALLOCATION_LIST",
  ADD_ALLOCATION_EDIT_IN_PROGRESS = "EnvelopeActions.ADD_ALLOCATION_EDIT_IN_PROGRESS",
  REMOVE_ALLOCATION_EDIT_IN_PROGRESS = "EnvelopeActions.REMOVE_ALLOCATION_EDIT_IN_PROGRESS",
}

enum EnvelopeCacheKeys {
  ENVELOPE_DATA = "EnvelopeCacheKeys.ENVELOPE_DATA",
  ENVELOPE_LIST = "EnvelopeCacheKeys.ENVELOPE_LIST",
  ALLOCATION_DATA = "EnvelopeCacheKeys.ALLOCATION_DATA",
  ALLOCATION_LIST = "EnvelopeCacheKeys.ALLOCATION_LIST",
}

// direct call to library method is deliberately not tested
/* istanbul ignore next */
function envelopeListIsCached(): boolean {
  return CacheKeyUtil.keyIsValid(EnvelopeCacheKeys.ENVELOPE_LIST, [
    EnvelopeCacheKeys.ENVELOPE_DATA,
    ProfileCacheKeys.ACTIVE_PROFILE,
  ]);
}

// direct call to library method is deliberately not tested
/* istanbul ignore next */
function allocationListIsCached(): boolean {
  return CacheKeyUtil.keyIsValid(EnvelopeCacheKeys.ALLOCATION_LIST, [
    EnvelopeCacheKeys.ALLOCATION_DATA,
    ProfileCacheKeys.ACTIVE_PROFILE,
  ]);
}

// envelope actions and sagas

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

function startLoadEnvelopeList(): PayloadAction {
  return {
    type: EnvelopeActions.START_LOAD_ENVELOPE_LIST,
  };
}

function setEnvelopeToEdit(envelope: IEnvelope): PayloadAction {
  return {
    type: EnvelopeActions.SET_ENVELOPE_TO_EDIT,
    payload: { envelope },
  };
}

function setEnvelopeEditorBusy(editorBusy: boolean): PayloadAction {
  return {
    type: EnvelopeActions.SET_ENVELOPE_EDITOR_BUSY,
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
      yield all([
        put(setEnvelopeEditorBusy(true)),
        call(() => axios.post(`/api/envelopes/edit/${envelopeId}`, envelope)),
      ]);
      yield all([
        put(CacheKeyUtil.updateKey(EnvelopeCacheKeys.ENVELOPE_DATA)),
        put(setEnvelopeEditorBusy(false)),
        put(setEnvelopeToEdit(undefined)),
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

// allocation actions and sagas

function startDeleteAllocation(allocation: IEnvelopeAllocation): PayloadAction {
  return {
    type: EnvelopeActions.START_DELETE_ALLOCATION,
    payload: { allocation },
  };
}

function startSaveAllocation(allocation: Partial<IEnvelopeAllocation>): PayloadAction {
  return {
    type: EnvelopeActions.START_SAVE_ALLOCATION,
    payload: { allocation },
  };
}

function startLoadAllocationList(): PayloadAction {
  return {
    type: EnvelopeActions.START_LOAD_ALLOCATION_LIST,
  };
}

function setDisplayActiveAllocationsOnly(activeOnly: boolean): PayloadAction {
  return {
    type: EnvelopeActions.SET_DISPLAY_ACTIVE_ALLOCATIONS_ONLY,
    payload: { activeOnly },
  };
}

function setAllocationToEdit(allocation: IEnvelopeAllocation): PayloadAction {
  return {
    type: EnvelopeActions.SET_ALLOCATION_TO_EDIT,
    payload: { allocation },
  };
}

function setAllocationEditorBusy(editorBusy: boolean): PayloadAction {
  return {
    type: EnvelopeActions.SET_ALLOCATION_EDITOR_BUSY,
    payload: { editorBusy },
  };
}

function setAllocationList(allocationList: IEnvelopeAllocation[]): PayloadAction {
  return {
    type: EnvelopeActions.SET_ALLOCATION_LIST,
    payload: { allocationList },
  };
}

function addAllocationEditInProgress(allocation: IEnvelopeAllocation): PayloadAction {
  return {
    type: EnvelopeActions.ADD_ALLOCATION_EDIT_IN_PROGRESS,
    payload: { allocation },
  };
}

function removeAllocationEditInProgress(allocation: IEnvelopeAllocation): PayloadAction {
  return {
    type: EnvelopeActions.REMOVE_ALLOCATION_EDIT_IN_PROGRESS,
    payload: { allocation },
  };
}

function* deleteAllocationSaga(): Generator {
  yield takeEvery(EnvelopeActions.START_DELETE_ALLOCATION, function*(action: PayloadAction): Generator {
    try {
      const allocation: IEnvelopeAllocation = action.payload.allocation;
      yield call(() => axios.post(`/api/envelope-allocations/delete/${allocation.id}`));
      yield put(CacheKeyUtil.updateKey(EnvelopeCacheKeys.ALLOCATION_DATA));
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* saveAllocationSaga(): Generator {
  yield takeEvery(EnvelopeActions.START_SAVE_ALLOCATION, function*(action: PayloadAction): Generator {
    try {
      const allocation: Partial<IEnvelopeAllocation> = mapEnvelopeAllocationForApi(action.payload.allocation);
      const allocationId = allocation.id || "";
      yield all([
        put(setAllocationEditorBusy(true)),
        call(() => axios.post(`/api/envelope-allocations/edit/${allocationId}`, allocation)),
      ]);
      yield all([
        put(CacheKeyUtil.updateKey(EnvelopeCacheKeys.ALLOCATION_DATA)),
        put(setAllocationEditorBusy(false)),
        put(setAllocationToEdit(undefined)),
      ]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* loadAllocationListSaga(): Generator {
  yield takeEvery(EnvelopeActions.START_LOAD_ALLOCATION_LIST, function*(): Generator {
    if (allocationListIsCached()) {
      return;
    }
    try {
      const allocationList: IEnvelopeAllocation[] = (yield call(async () => {
        const res = await axios.get("/api/envelope-allocations/list");
        const raw: IEnvelopeAllocation[] = res.data;
        return raw.map(mapEnvelopeAllocationFromApi);
      })) as IEnvelopeAllocation[];
      yield all([
        put(setAllocationList(allocationList)),
        put(CacheKeyUtil.updateKey(EnvelopeCacheKeys.ALLOCATION_LIST)),
      ]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* envelopesSagas(): Generator {
  yield all([
    deleteEnvelopeSaga(),
    saveEnvelopeSaga(),
    loadEnvelopeListSaga(),
    deleteAllocationSaga(),
    saveAllocationSaga(),
    loadAllocationListSaga(),
  ]);
}

function envelopesReducer(state = initialState, action: PayloadAction): IEnvelopesState {
  switch (action.type) {
    // envelopes

    case EnvelopeActions.SET_ENVELOPE_TO_EDIT:
      return {
        ...state,
        envelopeToEdit: action.payload.envelope,
      };

    case EnvelopeActions.SET_ENVELOPE_EDITOR_BUSY:
      return {
        ...state,
        envelopeEditorBusy: action.payload.editorBusy,
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

    // allocations

    case EnvelopeActions.SET_DISPLAY_ACTIVE_ALLOCATIONS_ONLY:
      return {
        ...state,
        displayActiveAllocationsOnly: action.payload.activeOnly,
      };

    case EnvelopeActions.SET_ALLOCATION_TO_EDIT:
      return {
        ...state,
        allocationToEdit: action.payload.allocation,
      };

    case EnvelopeActions.SET_ALLOCATION_EDITOR_BUSY:
      return {
        ...state,
        allocationEditorBusy: action.payload.editorBusy,
      };

    case EnvelopeActions.SET_ALLOCATION_LIST:
      return {
        ...state,
        allocationList: action.payload.allocationList,
      };

    case EnvelopeActions.ADD_ALLOCATION_EDIT_IN_PROGRESS:
      return ((): IEnvelopesState => {
        const allocation = action.payload.allocation as IEnvelopeAllocation;
        const arrCopy = [...state.allocationEditsInProgress];
        arrCopy.push(allocation);
        return {
          ...state,
          allocationEditsInProgress: arrCopy,
        };
      })();

    case EnvelopeActions.REMOVE_ALLOCATION_EDIT_IN_PROGRESS:
      return ((): IEnvelopesState => {
        const allocation = action.payload.allocation as IEnvelopeAllocation;
        const idx = state.allocationEditsInProgress.findIndex((a) => a.id === allocation.id);
        if (idx >= 0) {
          const arrCopy = [...state.allocationEditsInProgress];
          arrCopy.splice(idx, 1);
          return {
            ...state,
            allocationEditsInProgress: arrCopy,
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
  allocationListIsCached,
  startDeleteEnvelope,
  startSaveEnvelope,
  startLoadEnvelopeList,
  setEnvelopeToEdit,
  setEnvelopeEditorBusy,
  setEnvelopeList,
  addEnvelopeEditInProgress,
  removeEnvelopeEditInProgress,
  startDeleteAllocation,
  startSaveAllocation,
  startLoadAllocationList,
  setDisplayActiveAllocationsOnly,
  setAllocationToEdit,
  setAllocationEditorBusy,
  setAllocationList,
  addAllocationEditInProgress,
  removeAllocationEditInProgress,
};
