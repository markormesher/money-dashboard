import { describe } from "mocha";
import * as Moment from "moment";
import { getTaxYear, getTaxYearEnd, getTaxYearStart } from "./helpers";

describe(__filename, () => {

	describe("getTaxYear()", () => {
		it("should return the previous year if before or equal to April 5th", () => {
			getTaxYear(Moment("2018-01-01")).should.equal(2017);
			getTaxYear(Moment("2018-04-01")).should.equal(2017);
			getTaxYear(Moment("2018-04-05")).should.equal(2017);
		});

		it("should return the current year if after April 6th", () => {
			getTaxYear(Moment("2018-12-31")).should.equal(2018);
			getTaxYear(Moment("2018-04-30")).should.equal(2018);
			getTaxYear(Moment("2018-04-06")).should.equal(2018);
		});
	});

	describe("getTaxYearStart()", () => {
		it("should return correct values", () => {
			getTaxYearStart(2017).isSame(Moment("2017-04-06")).should.equal(true);
			getTaxYearStart(2018).isSame(Moment("2018-04-06")).should.equal(true);
		});
	});

	describe("getTaxYearEnd()", () => {
		it("should return correct values", () => {
			getTaxYearEnd(2017).isSame(Moment("2018-04-05")).should.equal(true);
			getTaxYearEnd(2018).isSame(Moment("2019-04-05")).should.equal(true);
		});
	});

	describe("groupBy()", () => {
		it("should have tests", () => {
			// TODO
		});
	});
});
