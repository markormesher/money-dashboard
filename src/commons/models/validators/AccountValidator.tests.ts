import { describe } from "mocha";
import { v4 } from "uuid";
import { IAccount, AccountTag } from "../IAccount";
import { DEFAULT_PROFILE } from "../IProfile";
import { CurrencyCode } from "../ICurrency";
import { validateAccount } from "./AccountValidator";

describe(__filename, () => {
  describe("validateAccount()", () => {
    const VALID_ACCOUNT: IAccount = {
      id: v4(),
      name: "Account",
      type: "current",
      tags: [],
      note: "note",
      currencyCode: "GBP",
      active: true,
      transactions: [],
      profile: DEFAULT_PROFILE,
      deleted: false,
    };

    it("should accept a valid account", () => {
      const result = validateAccount(VALID_ACCOUNT);
      result.isValid.should.equal(true);
      result.errors.should.deep.equal({});
    });

    it("should reject a null account", () => {
      const result = validateAccount(null);
      result.isValid.should.equal(false);
      result.errors.should.deep.equal({});
    });

    it("should reject an undefined account", () => {
      const result = validateAccount(undefined);
      result.isValid.should.equal(false);
      result.errors.should.deep.equal({});
    });

    it("should reject an account with no name", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, name: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("name");
      result.errors.name.should.not.equal("");
    });

    it("should reject an account with a blank name", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, name: "" });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("name");
      result.errors.name.should.not.equal("");
    });

    it("should reject an account with an all-whitespace name", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, name: "   " });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("name");
      result.errors.name.should.not.equal("");
    });

    it("should reject an account with no type", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, type: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("type");
      result.errors.type.should.not.equal("");
    });

    it("should reject an account with an invalid type", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, type: "invalid type" });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("type");
      result.errors.type.should.not.equal("");
    });

    it("should reject an account with an invalid tag", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, tags: ["not a real tag" as AccountTag] }); // force the type here
      result.isValid.should.equal(false);
      result.errors.should.have.keys("tags");
      result.errors.tags.should.not.equal("");
    });

    it("should reject an account with an invalid currency", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, currencyCode: "not a real currecy" as CurrencyCode });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("currencyCode");
      result.errors.currencyCode.should.not.equal("");
    });
  });
});
