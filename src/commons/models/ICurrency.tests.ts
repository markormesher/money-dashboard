import { expect } from "chai";
import { describe } from "mocha";
import { getCurrency, DEFAULT_CURRENCY_CODE, DEFAULT_CURRENCY, CurrencyCode } from "./ICurrency";

describe(__filename, () => {
  describe("getCurrency()", () => {
    it("should return the correct currency", () => {
      expect(getCurrency(DEFAULT_CURRENCY_CODE)).to.equal(DEFAULT_CURRENCY);
    });

    it("should throw an error for an invalid currency", () => {
      expect(() => getCurrency("ABC" as CurrencyCode)).to.throw("No currency found for the code ABC");
    });
  });
});
