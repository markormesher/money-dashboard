import { afterEach, describe } from "mocha";
import * as Moment from "moment";
import { IDateRange } from "../IDateRange";
import { validateDateRange } from "./DateRangeValidator";

describe(__filename, () => {

	describe("validateDateRange()", () => {

		const VALID_DATE_RANGE: IDateRange = {
			startDate: Moment("2018-01-01"),
			endDate: Moment("2018-01-31"),
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
			const result = validateDateRange({ ...VALID_DATE_RANGE, startDate: undefined });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("startDate");
			result.errors.startDate.should.not.equal("");
		});

		it("should reject a range with an invalid start date", () => {
			const result = validateDateRange({ ...VALID_DATE_RANGE, startDate: Moment("2018-01-40") });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("startDate");
			result.errors.startDate.should.not.equal("");
		});

		it("should reject a range with no end date", () => {
			const result = validateDateRange({ ...VALID_DATE_RANGE, endDate: undefined });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("endDate");
			result.errors.endDate.should.not.equal("");
		});

		it("should reject a range with an invalid end date", () => {
			const result = validateDateRange({ ...VALID_DATE_RANGE, endDate: Moment("2018-01-40") });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("endDate");
			result.errors.endDate.should.not.equal("");
		});

		it("should reject a range with start == end", () => {
			const result = validateDateRange({
				...VALID_DATE_RANGE,
				startDate: Moment("2018-01-01"),
				endDate: Moment("2018-01-01"),
			});
			result.isValid.should.equal(false);
			result.errors.should.have.keys(["startDate", "endDate"]);
			result.errors.startDate.should.not.equal("");
			result.errors.endDate.should.not.equal("");
		});

		it("should reject a range with start > end", () => {
			const result = validateDateRange({
				...VALID_DATE_RANGE,
				startDate: Moment("2018-01-02"),
				endDate: Moment("2018-01-01"),
			});
			result.isValid.should.equal(false);
			result.errors.should.have.keys(["startDate", "endDate"]);
			result.errors.startDate.should.not.equal("");
			result.errors.endDate.should.not.equal("");
		});
	});
});
