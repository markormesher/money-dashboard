import { expect } from "chai";
import { describe } from "mocha";
import { DEFAULT_ENVELOPE, mapEnvelopeFromApi, mapEnvelopeForApi } from "./IEnvelope";

describe(__filename, () => {
  describe("mapEnvelopeFromApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapEnvelopeFromApi(null)).to.equal(undefined);
      expect(mapEnvelopeFromApi(undefined)).to.equal(undefined);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(mapEnvelopeFromApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapEnvelopeFromApi(DEFAULT_ENVELOPE).should.not.equal(DEFAULT_ENVELOPE);
    });
  });

  describe("mapEnvelopeForApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapEnvelopeForApi(null)).to.equal(undefined);
      expect(mapEnvelopeForApi(undefined)).to.equal(undefined);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(mapEnvelopeForApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapEnvelopeForApi(DEFAULT_ENVELOPE).should.not.equal(DEFAULT_ENVELOPE);
    });
  });
});
