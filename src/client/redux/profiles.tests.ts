import { expect } from "chai";
import { describe, it } from "mocha";
import { DEFAULT_PROFILE } from "../../commons/models/IProfile";
import {
  ProfileActions,
  profilesReducer,
  setActiveProfile,
  setEditorBusy,
  setProfileSwitchInProgress,
  setProfileToEdit,
  startDeleteProfile,
  startSaveProfile,
  startSetCurrentProfile,
} from "./profiles";

describe(__filename, () => {
  describe("startDeleteProfile()", () => {
    it("should generate an action with the correct type", () => {
      startDeleteProfile(DEFAULT_PROFILE).type.should.equal(ProfileActions.START_DELETE_PROFILE);
    });

    it("should add the profile to the payload", () => {
      startDeleteProfile(DEFAULT_PROFILE).payload.should.have.keys("profile");
      startDeleteProfile(DEFAULT_PROFILE).payload.profile.should.equal(DEFAULT_PROFILE);
    });
  });

  describe("startSaveProfile()", () => {
    it("should generate an action with the correct type", () => {
      startSaveProfile(DEFAULT_PROFILE).type.should.equal(ProfileActions.START_SAVE_PROFILE);
    });

    it("should add the profile to the payload", () => {
      startSaveProfile(DEFAULT_PROFILE).payload.should.have.keys("profile");
      startSaveProfile(DEFAULT_PROFILE).payload.profile.should.equal(DEFAULT_PROFILE);
    });
  });

  describe("startSetCurrentProfile()", () => {
    it("should generate an action with the correct type", () => {
      startSetCurrentProfile(DEFAULT_PROFILE).type.should.equal(ProfileActions.START_SET_CURRENT_PROFILE);
    });

    it("should add the profile to the payload", () => {
      startSetCurrentProfile(DEFAULT_PROFILE).payload.should.have.keys("profile");
      startSetCurrentProfile(DEFAULT_PROFILE).payload.profile.should.equal(DEFAULT_PROFILE);
    });
  });

  describe("setProfileToEdit()", () => {
    it("should generate an action with the correct type", () => {
      setProfileToEdit(DEFAULT_PROFILE).type.should.equal(ProfileActions.SET_PROFILE_TO_EDIT);
    });

    it("should add the profile to the payload", () => {
      setProfileToEdit(DEFAULT_PROFILE).payload.should.have.keys("profile");
      setProfileToEdit(DEFAULT_PROFILE).payload.profile.should.equal(DEFAULT_PROFILE);
    });
  });

  describe("setEditorBusy()", () => {
    it("should generate an action with the correct type", () => {
      setEditorBusy(true).type.should.equal(ProfileActions.SET_EDITOR_BUSY);
    });

    it("should add the value to the payload", () => {
      setEditorBusy(true).payload.should.have.keys("editorBusy");
      setEditorBusy(true).payload.editorBusy.should.equal(true);
    });
  });

  describe("setActiveProfile()", () => {
    it("should generate an action with the correct type", () => {
      setActiveProfile(DEFAULT_PROFILE).type.should.equal(ProfileActions.SET_ACTIVE_PROFILE);
    });

    it("should add the profile to the payload", () => {
      setActiveProfile(DEFAULT_PROFILE).payload.should.have.keys("profile");
      setActiveProfile(DEFAULT_PROFILE).payload.profile.should.equal(DEFAULT_PROFILE);
    });
  });

  describe("setProfileSwitchInProgress()", () => {
    it("should generate an action with the correct type", () => {
      setProfileSwitchInProgress(true).type.should.equal(ProfileActions.SET_PROFILE_SWITCH_IN_PROGRESS);
    });

    it("should add the value to the payload", () => {
      setProfileSwitchInProgress(true).payload.should.have.keys("profileSwitchInProgress");
      setProfileSwitchInProgress(true).payload.profileSwitchInProgress.should.equal(true);
    });
  });

  describe("profilesReducer()", () => {
    it("should initialise its state correctly", () => {
      profilesReducer(undefined, { type: "@@INIT" }).should.deep.equal({
        activeProfile: undefined,
        profileToEdit: undefined,
        editorBusy: false,
        profileSwitchInProgress: false,
      });
    });

    describe(ProfileActions.SET_PROFILE_TO_EDIT, () => {
      it("should set the profile to edit", () => {
        expect(profilesReducer(undefined, setProfileToEdit(null)).profileToEdit).to.equal(null);
        expect(profilesReducer(undefined, setProfileToEdit(undefined)).profileToEdit).to.equal(undefined);
        profilesReducer(undefined, setProfileToEdit(DEFAULT_PROFILE)).profileToEdit.should.equal(DEFAULT_PROFILE);
      });
    });

    describe(ProfileActions.SET_EDITOR_BUSY, () => {
      it("should set the editor-busy flag", () => {
        profilesReducer(undefined, setEditorBusy(true)).editorBusy.should.equal(true);
        profilesReducer(undefined, setEditorBusy(false)).editorBusy.should.equal(false);
      });
    });

    describe(ProfileActions.SET_ACTIVE_PROFILE, () => {
      it("should set the active profile", () => {
        expect(profilesReducer(undefined, setActiveProfile(null)).activeProfile).to.equal(null);
        expect(profilesReducer(undefined, setActiveProfile(undefined)).activeProfile).to.equal(undefined);
        profilesReducer(undefined, setActiveProfile(DEFAULT_PROFILE)).activeProfile.should.equal(DEFAULT_PROFILE);
      });
    });

    describe(ProfileActions.SET_PROFILE_SWITCH_IN_PROGRESS, () => {
      it("should set the switch-in-progress flag", () => {
        profilesReducer(undefined, setProfileSwitchInProgress(true)).profileSwitchInProgress.should.equal(true);
        profilesReducer(undefined, setProfileSwitchInProgress(false)).profileSwitchInProgress.should.equal(false);
      });
    });
  });

  // TODO: sagas
});
