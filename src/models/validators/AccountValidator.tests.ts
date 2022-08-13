import { describe } from "mocha";
import { v4 } from "uuid";
import { IAccount, AccountTag, AccountType } from "../IAccount";
import { DEFAULT_PROFILE } from "../IProfile";
import { CurrencyCode } from "../ICurrency";
import { StockTicker } from "../IStock";
import { validateAccount } from "./AccountValidator";

describe(__filename, () => {
  describe("validateAccount()", () => {
    const VALID_ACCOUNT: IAccount = {
      id: v4(),
      name: "Account",
      type: "asset",
      tags: [],
      note: "note",
      currencyCode: "USD",
      stockTicker: "PLTR",
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
      result.errors.should.include.keys("name");
      result.errors.name.should.not.equal("");
    });

    it("should reject an account with a blank name", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, name: "" });
      result.isValid.should.equal(false);
      result.errors.should.include.keys("name");
      result.errors.name.should.not.equal("");
    });

    it("should reject an account with an all-whitespace name", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, name: "   " });
      result.isValid.should.equal(false);
      result.errors.should.include.keys("name");
      result.errors.name.should.not.equal("");
    });

    it("should reject an account with no type", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, type: undefined });
      result.isValid.should.equal(false);
      result.errors.should.include.keys("type");
      result.errors.type.should.not.equal("");
    });

    it("should reject an account with an invalid type", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, type: "invalid type" as AccountType });
      result.isValid.should.equal(false);
      result.errors.should.include.keys("type");
      result.errors.type.should.not.equal("");
    });

    it("should reject an account with an invalid tag", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, tags: ["not a real tag" as AccountTag] }); // force the type here
      result.isValid.should.equal(false);
      result.errors.should.include.keys("tags");
      result.errors.tags.should.not.equal("");
    });

    it("should reject the ISA tag with non-default currencies", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, currencyCode: "USD", tags: ["isa"] });
      result.isValid.should.equal(false);
      result.errors.should.include.keys("tags");
      result.errors.tags.should.not.equal("");
    });

    it("should reject the pension tag with non-default currencies", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, currencyCode: "USD", tags: ["pension"] });
      result.isValid.should.equal(false);
      result.errors.should.include.keys("tags");
      result.errors.tags.should.not.equal("");
    });

    it("should reject an account with an invalid currency", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, currencyCode: "not a real currency" as CurrencyCode });
      result.isValid.should.equal(false);
      result.errors.should.include.keys("currencyCode");
      result.errors.currencyCode.should.not.equal("");
    });

    it("should accept an account with a null stock ticker", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, stockTicker: null });
      result.isValid.should.equal(true);
      result.errors.should.deep.equal({});
    });

    it("should reject an account with an invalid stock ticker", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, stockTicker: "not a real ticker" as StockTicker });
      result.isValid.should.equal(false);
      result.errors.should.include.keys("stockTicker");
      result.errors.stockTicker.should.not.equal("");
    });

    it("should reject an account with the wrong base currency for a stock", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, stockTicker: "PLTR", currencyCode: "EUR" });
      result.isValid.should.equal(false);
      result.errors.should.include.keys("currencyCode");
      result.errors.currencyCode.should.not.equal("");
    });

    it("should reject a non-asset account with a stock ticker", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, stockTicker: "PLTR", type: "other" });
      result.isValid.should.equal(false);
      result.errors.should.include.keys("stockTicker");
      result.errors.stockTicker.should.not.equal("");
    });

    it("should reject the ISA tag with stock-linked accounts", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, stockTicker: "PLTR", tags: ["isa"] });
      result.isValid.should.equal(false);
      result.errors.should.include.keys("tags");
      result.errors.tags.should.not.equal("");
    });

    it("should reject the pension tag with stock-linked accounts", () => {
      const result = validateAccount({ ...VALID_ACCOUNT, stockTicker: "PLTR", tags: ["pension"] });
      result.isValid.should.equal(false);
      result.errors.should.include.keys("tags");
      result.errors.tags.should.not.equal("");
    });
  });
});
