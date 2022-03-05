import axios from "axios";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { IProfile, mapProfileForApi, mapProfileFromApi } from "../../models/IProfile";
import { startLoadCurrentUser } from "./auth";
import { setError } from "./global";
import { PayloadAction } from "./helpers/PayloadAction";
import { IRootState } from "./root";

// TODO: maybe move some of this to auth controller?

interface IProfilesState {
  readonly profileToEdit: IProfile;
  readonly editorBusy: boolean;
  readonly profileList: IProfile[];
  readonly profileSwitchInProgress: boolean;
}

const initialState: IProfilesState = {
  profileToEdit: undefined,
  editorBusy: false,
  profileList: undefined,
  profileSwitchInProgress: false,
};

interface IProfileAwareProps {
  readonly activeProfile?: IProfile;
}

function mapStateToProfileAwareProps(state: IRootState): IProfileAwareProps {
  return {
    activeProfile: state.auth.activeUser?.activeProfile,
  };
}

enum ProfileActions {
  START_DELETE_PROFILE = "ProfileActions.START_DELETE_PROFILE",
  START_SAVE_PROFILE = "ProfileActions.START_SAVE_PROFILE",
  START_SET_ACTIVE_PROFILE = "ProfileActions.START_SET_ACTIVE_PROFILE",
  START_LOAD_PROFILE_LIST = "ProfileActions.START_LOAD_PROFILE_LIST",

  SET_PROFILE_TO_EDIT = "ProfileActions.SET_PROFILE_TO_EDIT",
  SET_EDITOR_BUSY = "ProfileActions.SET_EDITOR_BUSY",
  SET_PROFILE_LIST = "ProfileActions.SET_PROFILE_LIST",
  SET_PROFILE_SWITCH_IN_PROGRESS = "ProfileActions.SET_PROFILE_SWITCH_IN_PROGRESS",
}

enum ProfileCacheKeys {
  PROFILE_DATA = "ProfileCacheKeys.PROFILE_DATA",
  PROFILE_LIST = "ProfileCacheKeys.PROFILE_LIST",
  ACTIVE_PROFILE = "ProfileCacheKeys.ACTIVE_PROFILE",
}

/* istanbul ignore next */
function profileListIsCached(): boolean {
  // direct call to library method is deliberately not tested
  /* istanbul ignore next */
  return CacheKeyUtil.keyIsValid(ProfileCacheKeys.PROFILE_LIST, [ProfileCacheKeys.PROFILE_DATA]);
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

function startSetActiveProfile(profile: IProfile): PayloadAction {
  return {
    type: ProfileActions.START_SET_ACTIVE_PROFILE,
    payload: { profile },
  };
}

function startLoadProfileList(): PayloadAction {
  return {
    type: ProfileActions.START_LOAD_PROFILE_LIST,
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

function setProfileList(profileList: IProfile[]): PayloadAction {
  return {
    type: ProfileActions.SET_PROFILE_LIST,
    payload: { profileList },
  };
}

function setProfileSwitchInProgress(profileSwitchInProgress: boolean): PayloadAction {
  return {
    type: ProfileActions.SET_PROFILE_SWITCH_IN_PROGRESS,
    payload: { profileSwitchInProgress },
  };
}

function* deleteProfileSaga(): Generator {
  yield takeEvery(ProfileActions.START_DELETE_PROFILE, function*(action: PayloadAction): Generator {
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
  yield takeEvery(ProfileActions.START_SAVE_PROFILE, function*(action: PayloadAction): Generator {
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

function* setActiveProfileSaga(): Generator {
  yield takeEvery(ProfileActions.START_SET_ACTIVE_PROFILE, function*(action: PayloadAction): Generator {
    try {
      const profile: IProfile = action.payload.profile;
      yield put(setProfileSwitchInProgress(true));
      yield call(() => axios.post(`/api/profiles/select/${profile.id}`));
      yield all([
        put(startLoadCurrentUser()), // reload the user to update the activeProfile field
        put(CacheKeyUtil.updateKey(ProfileCacheKeys.ACTIVE_PROFILE)),
        put(setProfileSwitchInProgress(false)),
      ]);
    } catch (err) {
      yield all([
        put(setError(err)),
        put(CacheKeyUtil.updateKey(ProfileCacheKeys.ACTIVE_PROFILE)),
        put(setProfileSwitchInProgress(false)),
      ]);
    }
  });
}

function* loadProfileListSaga(): Generator {
  yield takeEvery(ProfileActions.START_LOAD_PROFILE_LIST, function*(): Generator {
    if (profileListIsCached()) {
      return;
    }
    try {
      const profileList: IProfile[] = (yield call(async () => {
        const res = await axios.get("/api/profiles/list");
        const raw: IProfile[] = res.data;
        return raw.map(mapProfileFromApi);
      })) as IProfile[];
      yield all([put(setProfileList(profileList)), put(CacheKeyUtil.updateKey(ProfileCacheKeys.PROFILE_LIST))]);
    } catch (err) {
      yield put(setError(err));
    }
  });
}

function* profilesSagas(): Generator {
  yield all([deleteProfileSaga(), saveProfileSaga(), setActiveProfileSaga(), loadProfileListSaga()]);
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

    case ProfileActions.SET_PROFILE_LIST:
      return {
        ...state,
        profileList: action.payload.profileList,
      };

    case ProfileActions.SET_PROFILE_SWITCH_IN_PROGRESS:
      return {
        ...state,
        profileSwitchInProgress: action.payload.profileSwitchInProgress,
      };

    default:
      return state;
  }
}

export {
  IProfilesState,
  IProfileAwareProps,
  ProfileActions,
  ProfileCacheKeys,
  mapStateToProfileAwareProps,
  profilesReducer,
  profilesSagas,
  startDeleteProfile,
  startSaveProfile,
  startSetActiveProfile,
  startLoadProfileList,
  setProfileToEdit,
  setEditorBusy,
  setProfileSwitchInProgress,
  setProfileList,
};
