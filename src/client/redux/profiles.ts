import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { IProfile, mapProfileForApi } from "../../models/IProfile";
import { setError } from "./global";
import { PayloadAction } from "./helpers/PayloadAction";

interface IProfilesState {
  readonly profileToEdit: IProfile;
  readonly editorBusy: boolean;
}

const initialState: IProfilesState = {
  profileToEdit: undefined,
  editorBusy: false,
};

enum ProfileActions {
  START_DELETE_PROFILE = "ProfileActions.START_DELETE_PROFILE",
  START_SAVE_PROFILE = "ProfileActions.START_SAVE_PROFILE",

  SET_PROFILE_TO_EDIT = "ProfileActions.SET_PROFILE_TO_EDIT",
  SET_EDITOR_BUSY = "ProfileActions.SET_EDITOR_BUSY",
}

enum ProfileCacheKeys {
  PROFILE_DATA = "ProfileCacheKeys.PROFILE_DATA",
  ACTIVE_PROFILE = "ProfileCacheKeys.ACTIVE_PROFILE",
}

function startDeleteProfile(profile: IProfile): PayloadAction {
  return {
    type: ProfileActions.START_DELETE_PROFILE,
    payload: { profile },
  };
}

function startSaveProfile(profile: Partial<IProfile>): PayloadAction {
  return {
    type: ProfileActions.START_SAVE_PROFILE,
    payload: { profile },
  };
}

function setProfileToEdit(profile: IProfile): PayloadAction {
  return {
    type: ProfileActions.SET_PROFILE_TO_EDIT,
    payload: { profile },
  };
}

function setEditorBusy(editorBusy: boolean): PayloadAction {
  return {
    type: ProfileActions.SET_EDITOR_BUSY,
    payload: { editorBusy },
  };
}

function* deleteProfileSaga(): Generator {
  yield takeEvery(ProfileActions.START_DELETE_PROFILE, function* (action: PayloadAction): Generator {
    try {
      const profile: IProfile = action.payload.profile;
      yield call(() => axios.post(`/api/profiles/delete/${profile.id}`).then((res) => res.data));
      yield put(CacheKeyUtil.updateKey(ProfileCacheKeys.PROFILE_DATA));
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* saveProfileSaga(): Generator {
  yield takeEvery(ProfileActions.START_SAVE_PROFILE, function* (action: PayloadAction): Generator {
    try {
      const profile: Partial<IProfile> = mapProfileForApi(action.payload.profile);
      const profileId = profile.id || "";
      yield all([put(setEditorBusy(true)), call(() => axios.post(`/api/profiles/edit/${profileId}`, profile))]);
      yield all([
        put(CacheKeyUtil.updateKey(ProfileCacheKeys.PROFILE_DATA)),
        put(setEditorBusy(false)),
        put(setProfileToEdit(undefined)),
      ]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* profilesSagas(): Generator {
  yield all([deleteProfileSaga(), saveProfileSaga()]);
}

function profilesReducer(state = initialState, action: PayloadAction): IProfilesState {
  switch (action.type) {
    case ProfileActions.SET_PROFILE_TO_EDIT:
      return {
        ...state,
        profileToEdit: action.payload.profile,
      };

    case ProfileActions.SET_EDITOR_BUSY:
      return {
        ...state,
        editorBusy: action.payload.editorBusy,
      };

    default:
      return state;
  }
}

export {
  IProfilesState,
  ProfileActions,
  ProfileCacheKeys,
  profilesReducer,
  profilesSagas,
  startDeleteProfile,
  startSaveProfile,
  setProfileToEdit,
  setEditorBusy,
};
