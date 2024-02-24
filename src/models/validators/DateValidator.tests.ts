import { describe } from "mocha";
import { parseISO } from "date-fns";
import { validateDate } from "./DateValidator";

describe(__filename, () => {
  describe("validateDate()", () => {
    it("should accept a valid date", () => {
      const result = validateDate({ date: parseISO("2018-01-01").getTime() });
      result.isValid.should.equal(true);
      result.errors.should.deep.equal({});
    });

    it("should reject a null date", () => {
      const result = validateDate(null);
      result.isValid.should.equal(false);
      result.errors.should.have.keys("date");
      result.errors.date.should.not.equal("");
    });

    it("should reject an undefined date", () => {
      const result = validateDate(undefined);
      result.isValid.should.equal(false);
      result.errors.should.have.keys("date");
      result.errors.date.should.not.equal("");
    });

    it("should reject a date < global minimum", () => {
      const result = validateDate({ date: Date.UTC(2010, 0, 1, 0, 0, 0) });
      result.isValid.should.equal(false);
      result.errors.should.have.keys("date");
      result.errors.date.should.not.equal("");
    });
  });
});
