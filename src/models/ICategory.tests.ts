import { expect } from "chai";
import { describe } from "mocha";
import { DEFAULT_CATEGORY, mapCategoryFromApi, mapCategoryForApi } from "./ICategory";

describe(__filename, () => {
  describe("mapCategoryFromApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapCategoryFromApi(null)).to.equal(undefined);
      expect(mapCategoryFromApi(undefined)).to.equal(undefined);

      // @ts-expect-error testing wrong argument type
      expect(mapCategoryFromApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapCategoryFromApi(DEFAULT_CATEGORY).should.not.equal(DEFAULT_CATEGORY);
    });
  });

  describe("mapCategoryForApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapCategoryForApi(null)).to.equal(undefined);
      expect(mapCategoryForApi(undefined)).to.equal(undefined);

      // @ts-expect-error testing wrong argument type
      expect(mapCategoryForApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapCategoryForApi(DEFAULT_CATEGORY).should.not.equal(DEFAULT_CATEGORY);
    });
  });
});
