import { describe } from "mocha";
import { parseISO } from "date-fns";
import { IDateRange } from "../IDateRange";
import { validateDateRange } from "./DateRangeValidator";

describe(__filename, () => {
  describe("validateDateRange()", () => {
    const VALID_DATE_RANGE: IDateRange = {
      startDate: parseISO("2018-01-01").getTime(),
      endDate: parseISO("2018-01-31").getTime(),
    };

    it("should accept a valid range", () => {
      const result = validateDateRange(VALID_DATE_RANGE);
      result.isValid.should.equal(true);
      result.errors.should.deep.equal({});
    });

    it("should reject a null range", () => {
      const result = validateDateRange(null);
      result.isValid.should.equal(false);
      result.errors.should.deep.equal({});
    });

    it("should reject an undefined range", () => {
      const result = validateDateRange(undefined);
      result.isValid.should.equal(false);
      result.errors.should.deep.equal({});
    });

    it("should reject a range with no start date", () => {
      const result = validateDateRange({
        ...VALID_DATE_RANGE,
        startDate: undefined,
      });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("startDate");
      result.errors.startDate.should.not.equal("");
    });

    it("should reject a range with no end date", () => {
      const result = validateDateRange({
        ...VALID_DATE_RANGE,
        endDate: undefined,
      });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("endDate");
      result.errors.endDate.should.not.equal("");
    });

    it("should reject a range with start < global minimum", () => {
      const result = validateDateRange({
        ...VALID_DATE_RANGE,
        startDate: Date.UTC(2010, 0, 1, 0, 0, 0),
      });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("startDate");
      result.errors.startDate.should.not.equal("");
    });

    it("should reject a range with end < global minimum", () => {
      const result = validateDateRange({
        ...VALID_DATE_RANGE,
        endDate: Date.UTC(2010, 0, 1, 0, 0, 0),
      });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("endDate");
      result.errors.endDate.should.not.equal("");
    });

    it("should reject a range with start == end", () => {
      const result = validateDateRange({
        ...VALID_DATE_RANGE,
        startDate: parseISO("2018-01-01").getTime(),
        endDate: parseISO("2018-01-01").getTime(),
      });
      result.isValid.should.equal(false);
      result.errors.should.have.keys(["startDate", "endDate"]);
      result.errors.startDate.should.not.equal("");
      result.errors.endDate.should.not.equal("");
    });

    it("should reject a range with start > end", () => {
      const result = validateDateRange({
        ...VALID_DATE_RANGE,
        startDate: parseISO("2018-01-02").getTime(),
        endDate: parseISO("2018-01-01").getTime(),
      });
      result.isValid.should.equal(false);
      result.errors.should.have.keys(["startDate", "endDate"]);
      result.errors.startDate.should.not.equal("");
      result.errors.endDate.should.not.equal("");
    });
  });
});
