import { describe, it } from "mocha";
import { closeNav, NavActions, navReducer, openNav } from "./nav";

describe(__filename, () => {
  describe("openNav()", () => {
    it("should generate an action with the correct type", () => {
      openNav().type.should.equal(NavActions.OPEN_NAV);
    });
  });

  describe("closeNav()", () => {
    it("should generate an action with the correct type", () => {
      closeNav().type.should.equal(NavActions.CLOSE_NAV);
    });
  });

  describe("navReducer()", () => {
    it("should initialise its state correctly", () => {
      navReducer(undefined, { type: "@@INIT" }).should.deep.equal({
        isOpen: false,
      });
    });

    describe(NavActions.OPEN_NAV, () => {
      it("should set the flag to true", () => {
        navReducer(undefined, openNav()).isOpen.should.equal(true);
      });
    });

    describe(NavActions.CLOSE_NAV, () => {
      it("should set the flag to false", () => {
        navReducer(undefined, closeNav()).isOpen.should.equal(false);
      });
    });
  });
});
