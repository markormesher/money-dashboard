import { expect } from "chai";
import { describe } from "mocha";
import { DEFAULT_BUDGET, mapBudgetFromApi } from "./IBudget";

describe(__filename, () => {
  describe("mapBudgetFromApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapBudgetFromApi(null)).to.equal(undefined);
      expect(mapBudgetFromApi(undefined)).to.equal(undefined);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(mapBudgetFromApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapBudgetFromApi(DEFAULT_BUDGET).should.not.equal(DEFAULT_BUDGET);
    });
  });
});
