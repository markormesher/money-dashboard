import { describe } from "mocha";
import { v4 } from "uuid";
import { IProfile } from "../IProfile";
import { validateProfile } from "./ProfileValidator";

describe(__filename, () => {
  describe("validateProfile()", () => {
    const VALID_PROFILE: IProfile = {
      id: v4(),
      name: "Profile",
      accounts: [],
      budgets: [],
      categories: [],
      transactions: [],
      users: [],
      usersWithProfileActivated: [],
      deleted: false,
    };

    it("should accept a valid profile", () => {
      const result = validateProfile(VALID_PROFILE);
      result.isValid.should.equal(true);
      result.errors.should.deep.equal({});
    });

    it("should reject a null profile", () => {
      const result = validateProfile(null);
      result.isValid.should.equal(false);
      result.errors.should.deep.equal({});
    });

    it("should reject an undefined profile", () => {
      const result = validateProfile(undefined);
      result.isValid.should.equal(false);
      result.errors.should.deep.equal({});
    });

    it("should reject an profile with no name", () => {
      const result = validateProfile({ ...VALID_PROFILE, name: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("name");
      result.errors.name.should.not.equal("");
    });

    it("should reject an profile with a blank name", () => {
      const result = validateProfile({ ...VALID_PROFILE, name: "" });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("name");
      result.errors.name.should.not.equal("");
    });

    it("should reject an profile with an all-whitespace name", () => {
      const result = validateProfile({ ...VALID_PROFILE, name: "   " });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("name");
      result.errors.name.should.not.equal("");
    });
  });
});
