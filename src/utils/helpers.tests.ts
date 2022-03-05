import { describe } from "mocha";
import { parseISO, endOfDay, startOfDay } from "date-fns";
import { getTaxYear, getTaxYearEnd, getTaxYearStart, groupBy } from "./helpers";

describe(__filename, () => {
  describe("getTaxYear()", () => {
    it("should return the previous year if before or equal to April 5th", () => {
      getTaxYear(parseISO("2018-01-01").getTime()).should.equal(2017);
      getTaxYear(parseISO("2018-04-01").getTime()).should.equal(2017);
      getTaxYear(parseISO("2018-04-05").getTime()).should.equal(2017);
    });

    it("should return the current year if after April 6th", () => {
      getTaxYear(parseISO("2018-12-31").getTime()).should.equal(2018);
      getTaxYear(parseISO("2018-04-30").getTime()).should.equal(2018);
      getTaxYear(parseISO("2018-04-06").getTime()).should.equal(2018);
    });
  });

  describe("getTaxYearStart()", () => {
    it("should return correct values", () => {
      getTaxYearStart(2017).should.equal(startOfDay(parseISO("2017-04-06")).getTime());
      getTaxYearStart(2018).should.equal(startOfDay(parseISO("2018-04-06")).getTime());
    });
  });

  describe("getTaxYearEnd()", () => {
    it("should return correct values", () => {
      getTaxYearEnd(2017).should.equal(endOfDay(parseISO("2018-04-05")).getTime());
      getTaxYearEnd(2018).should.equal(endOfDay(parseISO("2019-04-05")).getTime());
    });
  });

  describe("groupBy()", () => {
    it("should return empty output for empty input", () => {
      const actual = groupBy([], () => 0);
      const expected = {};
      JSON.stringify(actual).should.equal(JSON.stringify(expected));
    });

    it("should group by a numeric identifier", () => {
      const ungrouped = [
        { id: 0, name: "a" },
        { id: 0, name: "b" },
        { id: 1, name: "c" },
      ];
      const actual = groupBy(ungrouped, (v) => v.id);
      const expected = {
        0: [
          { id: 0, name: "a" },
          { id: 0, name: "b" },
        ],
        1: [{ id: 1, name: "c" }],
      };
      JSON.stringify(actual).should.equal(JSON.stringify(expected));
    });

    it("should group by a string identifier", () => {
      const ungrouped = [
        { id: "0", name: "a" },
        { id: "0", name: "b" },
        { id: "1", name: "c" },
      ];
      const actual = groupBy(ungrouped, (v) => v.id);
      const expected = {
        "0": [
          { id: "0", name: "a" },
          { id: "0", name: "b" },
        ],
        "1": [{ id: "1", name: "c" }],
      };
      JSON.stringify(actual).should.equal(JSON.stringify(expected));
    });
  });
});
