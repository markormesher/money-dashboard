import { describe } from "mocha";
import { v4 } from "uuid";
import { ICategory } from "../ICategory";
import { DEFAULT_PROFILE } from "../IProfile";
import { validateCategory } from "./CategoryValidator";

describe(__filename, () => {
  describe("validateCategory()", () => {
    const VALID_CATEGORY: ICategory = {
      id: v4(),
      name: "Category",
      isAssetGrowthCategory: false,
      isExpenseCategory: false,
      isIncomeCategory: false,
      isMemoCategory: false,
      budgets: [],
      transactions: [],
      envelopeAllocations: [],
      profile: DEFAULT_PROFILE,
      deleted: false,
    };

    it("should accept a valid category", () => {
      const result = validateCategory(VALID_CATEGORY);
      result.isValid.should.equal(true);
      result.errors.should.deep.equal({});
    });

    it("should reject a null category", () => {
      const result = validateCategory(null);
      result.isValid.should.equal(false);
      result.errors.should.deep.equal({});
    });

    it("should reject an undefined category", () => {
      const result = validateCategory(undefined);
      result.isValid.should.equal(false);
      result.errors.should.deep.equal({});
    });

    it("should reject an category with no name", () => {
      const result = validateCategory({ ...VALID_CATEGORY, name: undefined });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("name");
      result.errors.name.should.not.equal("");
    });

    it("should reject an category with a blank name", () => {
      const result = validateCategory({ ...VALID_CATEGORY, name: "" });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("name");
      result.errors.name.should.not.equal("");
    });

    it("should reject an category with an all-whitespace name", () => {
      const result = validateCategory({ ...VALID_CATEGORY, name: "   " });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("name");
      result.errors.name.should.not.equal("");
    });
  });
});
