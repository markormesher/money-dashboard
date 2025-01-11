import { expect } from "chai";
import { describe } from "mocha";
import { DEFAULT_BUDGET, mapBudgetFromApi, mapBudgetForApi } from "./IBudget";

describe(__filename, () => {
  describe("mapBudgetFromApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapBudgetFromApi(null)).to.equal(undefined);
      expect(mapBudgetFromApi(undefined)).to.equal(undefined);

      // @ts-expect-error testing wrong argument type
      expect(mapBudgetFromApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapBudgetFromApi(DEFAULT_BUDGET).should.not.equal(DEFAULT_BUDGET);
    });
  });

  describe("mapBudgetForApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapBudgetForApi(null)).to.equal(undefined);
      expect(mapBudgetForApi(undefined)).to.equal(undefined);

      // @ts-expect-error testing wrong argument type
      expect(mapBudgetForApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapBudgetForApi(DEFAULT_BUDGET).should.not.equal(DEFAULT_BUDGET);
    });
  });
});
