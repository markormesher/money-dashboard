import { expect } from "chai";
import { describe } from "mocha";
import { DEFAULT_PROFILE, mapProfileFromApi, mapProfileForApi } from "./IProfile";

describe(__filename, () => {
  describe("mapProfileFromApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapProfileFromApi(null)).to.equal(undefined);
      expect(mapProfileFromApi(undefined)).to.equal(undefined);

      // @ts-expect-error testing wrong argument type
      expect(mapProfileFromApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapProfileFromApi(DEFAULT_PROFILE).should.not.equal(DEFAULT_PROFILE);
    });
  });

  describe("mapProfileForApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapProfileForApi(null)).to.equal(undefined);
      expect(mapProfileForApi(undefined)).to.equal(undefined);

      // @ts-expect-error testing wrong argument type
      expect(mapProfileForApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapProfileForApi(DEFAULT_PROFILE).should.not.equal(DEFAULT_PROFILE);
    });
  });
});
