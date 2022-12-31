import { expect } from "chai";
import { describe } from "mocha";
import {
  DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION,
  mapEnvelopeAllocationFromApi,
  mapEnvelopeAllocationForApi,
} from "./IEnvelopeAllocation";

describe(__filename, () => {
  describe("mapEnvelopeAllocationFromApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapEnvelopeAllocationFromApi(null)).to.equal(undefined);
      expect(mapEnvelopeAllocationFromApi(undefined)).to.equal(undefined);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(mapEnvelopeAllocationFromApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapEnvelopeAllocationFromApi(DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION).should.not.equal(
        DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION,
      );
    });
  });

  describe("mapEnvelopeAllocationForApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapEnvelopeAllocationForApi(null)).to.equal(undefined);
      expect(mapEnvelopeAllocationForApi(undefined)).to.equal(undefined);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(mapEnvelopeAllocationForApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapEnvelopeAllocationForApi(DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION).should.not.equal(
        DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION,
      );
    });
  });
});
