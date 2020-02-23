import { describe, it } from "mocha";
import { DetailedError } from "../helpers/errors/DetailedError";
import {
  addWait,
  GlobalActions,
  globalReducer,
  IGlobalState,
  removeWait,
  setError,
  setKeyShortcutModalVisible,
} from "./global";

describe(__filename, () => {
  describe("addWait()", () => {
    it("should generate an action with the correct type", () => {
      addWait("test-key").type.should.equal(GlobalActions.ADD_WAIT);
    });

    it("should add the wait key to the payload", () => {
      addWait("test-key").payload.should.have.keys("wait");
      addWait("test-key").payload.wait.should.equal("test-key");
    });
  });

  describe("removeWait()", () => {
    it("should generate an action with the correct type", () => {
      removeWait("test-key").type.should.equal(GlobalActions.REMOVE_WAIT);
    });

    it("should add the wait key to the payload", () => {
      removeWait("test-key").payload.should.have.keys("wait");
      removeWait("test-key").payload.wait.should.equal("test-key");
    });
  });

  describe("setError()", () => {
    const err = new DetailedError();

    it("should generate an action with the correct type", () => {
      setError(err).type.should.equal(GlobalActions.SET_ERROR);
    });

    it("should add the error to the payload", () => {
      setError(err).payload.should.have.keys("error");
      setError(err).payload.error.should.equal(err);
    });
  });

  describe("setKeyShortcutModalVisible()", () => {
    it("should generate an action with the correct type", () => {
      setKeyShortcutModalVisible(true).type.should.equal(GlobalActions.SET_KEY_SHORTCUT_MODAL_VISIBLE);
    });

    it("should add the error to the payload", () => {
      setKeyShortcutModalVisible(true).payload.should.have.keys("keyShortcutModalVisible");
      setKeyShortcutModalVisible(true).payload.keyShortcutModalVisible.should.equal(true);
    });
  });

  describe("globalReducer()", () => {
    const initialState = globalReducer(undefined, { type: "@@INIT" });

    it("should initialise its state correctly", () => {
      globalReducer(undefined, { type: "@@INIT" }).should.deep.equal({
        waitingFor: [],
        error: undefined,
        keyShortcutModalVisible: false,
      });
    });

    describe(GlobalActions.ADD_WAIT, () => {
      it("should add the key to an empty list", () => {
        const state = globalReducer(undefined, addWait("test-key"));
        state.waitingFor.should.have.all.members(["test-key"]);
      });

      it("should add the key to a non-empty list", () => {
        let state: IGlobalState = { ...initialState, waitingFor: ["test-key1"] };
        state = globalReducer(state, addWait("test-key2"));
        state.waitingFor.should.have.all.members(["test-key1", "test-key2"]);
      });

      it("should allow duplicate keys", () => {
        let state = globalReducer(undefined, addWait("test-key"));
        state = globalReducer(state, addWait("test-key"));
        state.waitingFor.should.have.all.members(["test-key", "test-key"]);
      });
    });

    describe(GlobalActions.REMOVE_WAIT, () => {
      it("should do nothing to an empty list", () => {
        let state: IGlobalState = { ...initialState, waitingFor: [] };
        state = globalReducer(state, removeWait("test-key"));
        state.waitingFor.should.have.all.members([]);
      });

      it("should do nothing to a list containing no matches", () => {
        let state: IGlobalState = { ...initialState, waitingFor: ["test-key1"] };
        state = globalReducer(state, removeWait("test-key2"));
        state.waitingFor.should.have.all.members(["test-key1"]);
      });

      it("should remove a matching key when it is the only key", () => {
        let state: IGlobalState = { ...initialState, waitingFor: ["test-key1"] };
        state = globalReducer(state, removeWait("test-key1"));
        state.waitingFor.should.have.all.members([]);
      });

      it("should remove a matching key when it is not the only key", () => {
        let state: IGlobalState = { ...initialState, waitingFor: ["test-key1", "test-key2"] };
        state = globalReducer(state, removeWait("test-key1"));
        state.waitingFor.should.have.all.members(["test-key2"]);
      });

      it("should remove only one matching key when duplicates exist", () => {
        let state: IGlobalState = { ...initialState, waitingFor: ["test-key", "test-key"] };
        state = globalReducer(state, removeWait("test-key"));
        state.waitingFor.should.have.all.members(["test-key"]);
      });
    });

    describe(GlobalActions.SET_ERROR, () => {
      it("should set the error", () => {
        const err = new DetailedError();
        globalReducer(undefined, setError(err)).error.should.equal(err);
      });
    });

    describe(GlobalActions.SET_KEY_SHORTCUT_MODAL_VISIBLE, () => {
      it("should set the visibility flag", () => {
        globalReducer(undefined, setKeyShortcutModalVisible(true)).keyShortcutModalVisible.should.equal(true);
        globalReducer(undefined, setKeyShortcutModalVisible(false)).keyShortcutModalVisible.should.equal(false);
      });
    });
  });
});
