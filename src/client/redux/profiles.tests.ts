import { afterEach, beforeEach, describe, it } from "mocha";
import { DEFAULT_PROFILE } from "../../api/models/IProfile";
import {
	ProfileActions,
	setCurrentProfile,
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

	describe("setCurrentProfile()", () => {

		it("should generate an action with the correct type", () => {
			setCurrentProfile(DEFAULT_PROFILE).type.should.equal(ProfileActions.SET_CURRENT_PROFILE);
		});

		it("should add the profile to the payload", () => {
			setCurrentProfile(DEFAULT_PROFILE).payload.should.have.keys("profile");
			setCurrentProfile(DEFAULT_PROFILE).payload.profile.should.equal(DEFAULT_PROFILE);
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

	// TODO: reducer

	// TODO: sagas
});
