import { expect } from "chai";
import { describe } from "mocha";
import {
  DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION,
  mapCategoryToEnvelopeAllocationFromApi,
  mapCategoryToEnvelopeAllocationForApi,
} from "./ICategoryToEnvelopeAllocation";

describe(__filename, () => {
  describe("mapCategoryToEnvelopeAllocationFromApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapCategoryToEnvelopeAllocationFromApi(null)).to.equal(undefined);
      expect(mapCategoryToEnvelopeAllocationFromApi(undefined)).to.equal(undefined);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(mapCategoryToEnvelopeAllocationFromApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapCategoryToEnvelopeAllocationFromApi(DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION).should.not.equal(
        DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION,
      );
    });
  });

  describe("mapCategoryToEnvelopeAllocationForApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapCategoryToEnvelopeAllocationForApi(null)).to.equal(undefined);
      expect(mapCategoryToEnvelopeAllocationForApi(undefined)).to.equal(undefined);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(mapCategoryToEnvelopeAllocationForApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapCategoryToEnvelopeAllocationForApi(DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION).should.not.equal(
        DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION,
      );
    });
  });
});
