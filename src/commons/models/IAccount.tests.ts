import { expect } from "chai";
import { describe } from "mocha";
import { DEFAULT_ACCOUNT, mapAccountFromApi } from "./IAccount";

describe(__filename, () => {
  describe("mapAccountFromApi()", () => {
    it("should return undefined for null/undefined/empty-string inputs", () => {
      expect(mapAccountFromApi(null)).to.equal(undefined);
      expect(mapAccountFromApi(undefined)).to.equal(undefined);

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      expect(mapAccountFromApi("")).to.equal(undefined);
    });

    it("should not mutate the input", () => {
      mapAccountFromApi(DEFAULT_ACCOUNT).should.not.equal(DEFAULT_ACCOUNT);
    });
  });
});
