import { expect } from "chai";
import { describe } from "mocha";
import { getStock, StockTicker } from "./IStock";

describe(__filename, () => {
  describe("getStock()", () => {
    it("should return the correct stock", () => {
      expect(getStock("PLTR")).to.include({ ticker: "PLTR" });
    });

    it("should throw an error for an invalid currency", () => {
      expect(() => getStock("ABC" as StockTicker)).to.throw("No stock found for the ticker ABC");
    });
  });
});
