import { expect } from "chai";
import { describe, it } from "mocha";
import { DEFAULT_PROFILE } from "../../commons/models/IProfile";
import { IUser } from "../../commons/models/IUser";
import { AuthActions, authReducer, setCurrentUser, startLoadCurrentUser, unsetCurrentUser } from "./auth";

describe(__filename, () => {
  const user: IUser = {
    id: "id",
    externalUsername: "external username",
    displayName: "display name",
    image: "image",
    profiles: [DEFAULT_PROFILE],
    activeProfile: DEFAULT_PROFILE,
    deleted: false,
  };

  describe("startLoadCurrentUser()", () => {
    it("should generate an action with the correct type", () => {
      startLoadCurrentUser().type.should.equal(AuthActions.START_LOAD_CURRENT_USER);
    });
  });

  describe("setCurrentUser()", () => {
    it("should setCurrentUser an action with the correct type", () => {
      setCurrentUser(user).type.should.equal(AuthActions.SET_CURRENT_USER);
    });

    it("should add the account to the payload", () => {
      setCurrentUser(user).payload.should.have.keys("user");
      setCurrentUser(user).payload.user.should.equal(user);
    });
  });

  describe("unsetCurrentUser()", () => {
    it("should generate an action with the correct type", () => {
      unsetCurrentUser().type.should.equal(AuthActions.UNSET_CURRENT_USER);
    });
  });

  describe("authReducer()", () => {
    it("should initialise its state correctly", () => {
      authReducer(undefined, { type: "@@INIT" }).should.deep.equal({
        activeUser: undefined,
      });
    });

    describe(AuthActions.SET_CURRENT_USER, () => {
      it("should set the current user", () => {
        authReducer(undefined, setCurrentUser(user)).activeUser.should.equal(user);
      });
    });

    describe(AuthActions.UNSET_CURRENT_USER, () => {
      it("should unset the current user", () => {
        expect(authReducer(undefined, unsetCurrentUser()).activeUser).to.equal(undefined);
      });
    });
  });

  // TODO: sagas
});
