import { expect } from "chai";
import { describe } from "mocha";
import { DEFAULT_CATEGORY, mapCategoryFromApi } from "./ICategory";

describe(__filename, () => {
  describe("mapCategoryFromApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapCategoryFromApi(null)).to.equal(undefined);
      expect(mapCategoryFromApi(undefined)).to.equal(undefined);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(mapCategoryFromApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapCategoryFromApi(DEFAULT_CATEGORY).should.not.equal(DEFAULT_CATEGORY);
    });
  });
});
