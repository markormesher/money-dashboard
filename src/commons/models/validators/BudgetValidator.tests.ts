import { describe } from "mocha";
import * as Moment from "moment";
import { v4 } from "uuid";
import { IBudget } from "../IBudget";
import { DEFAULT_CATEGORY } from "../ICategory";
import { DEFAULT_PROFILE } from "../IProfile";
import { validateBudget } from "./BudgetValidator";

describe(__filename, () => {

	describe("validateBudget()", () => {

		const VALID_BUDGET: IBudget = {
			id: v4(),
			type: "budget",
			amount: 100,
			startDate: Moment("2018-01-01"),
			endDate: Moment("2018-01-31"),
			category: { ...DEFAULT_CATEGORY, id: v4() },
			profile: DEFAULT_PROFILE,
			deleted: false,
		};

		it("should accept a valid budget", () => {
			const result = validateBudget(VALID_BUDGET);
			result.isValid.should.equal(true);
			result.errors.should.deep.equal({});
		});

		it("should reject a null budget", () => {
			const result = validateBudget(null);
			result.isValid.should.equal(false);
			result.errors.should.deep.equal({});
		});

		it("should reject an undefined budget", () => {
			const result = validateBudget(undefined);
			result.isValid.should.equal(false);
			result.errors.should.deep.equal({});
		});

		it("should reject a budget with no type", () => {
			const result = validateBudget({ ...VALID_BUDGET, type: undefined });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("type");
			result.errors.type.should.not.equal("");
		});

		it("should reject a budget with an invalid type", () => {
			// clone the valid budget and then change the type without making typescript angry
			const badBudget = { ...VALID_BUDGET };
			Object.defineProperty(badBudget, "type", { writable: true, value: "invalid" });
			const result = validateBudget(badBudget);
			result.isValid.should.equal(false);
			result.errors.should.have.keys("type");
			result.errors.type.should.not.equal("");
		});

		it("should reject a budget with no amount", () => {
			const result = validateBudget({ ...VALID_BUDGET, amount: undefined });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("amount");
			result.errors.amount.should.not.equal("");
		});

		it("should reject a budget with a NaN amount", () => {
			const result = validateBudget({ ...VALID_BUDGET, amount: NaN });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("amount");
			result.errors.amount.should.not.equal("");
		});

		it("should reject a budget with a zero amount", () => {
			const result = validateBudget({ ...VALID_BUDGET, amount: 0 });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("amount");
			result.errors.amount.should.not.equal("");
		});

		it("should reject a budget with a negative amount", () => {
			const result = validateBudget({ ...VALID_BUDGET, amount: -1 });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("amount");
			result.errors.amount.should.not.equal("");
		});

		it("should reject a budget with no category", () => {
			const result = validateBudget({ ...VALID_BUDGET, category: undefined });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("category");
			result.errors.category.should.not.equal("");
		});

		it("should reject a budget with a category with no ID", () => {
			const result = validateBudget({ ...VALID_BUDGET, category: { ...DEFAULT_CATEGORY, id: null } });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("category");
			result.errors.category.should.not.equal("");
		});

		it("should reject a budget with a category with a blank ID", () => {
			const result = validateBudget({ ...VALID_BUDGET, category: { ...DEFAULT_CATEGORY, id: "" } });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("category");
			result.errors.category.should.not.equal("");
		});

		it("should reject a budget with a category with a whitespace ID", () => {
			const result = validateBudget({ ...VALID_BUDGET, category: { ...DEFAULT_CATEGORY, id: "   " } });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("category");
			result.errors.category.should.not.equal("");
		});

		it("should reject a budget with no start date", () => {
			const result = validateBudget({ ...VALID_BUDGET, startDate: undefined });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("startDate");
			result.errors.startDate.should.not.equal("");
		});

		it("should reject a budget with an invalid start date", () => {
			const result = validateBudget({ ...VALID_BUDGET, startDate: Moment("2018-01-40") });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("startDate");
			result.errors.startDate.should.not.equal("");
		});

		it("should reject a budget with no end date", () => {
			const result = validateBudget({ ...VALID_BUDGET, endDate: undefined });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("endDate");
			result.errors.endDate.should.not.equal("");
		});

		it("should reject a budget with an invalid end date", () => {
			const result = validateBudget({ ...VALID_BUDGET, endDate: Moment("2018-01-40") });
			result.isValid.should.equal(false);
			result.errors.should.have.keys("endDate");
			result.errors.endDate.should.not.equal("");
		});

		it("should reject a budget with start == end", () => {
			const result = validateBudget({
				...VALID_BUDGET,
				startDate: Moment("2018-01-01"),
				endDate: Moment("2018-01-01"),
			});
			result.isValid.should.equal(false);
			result.errors.should.have.keys(["startDate", "endDate"]);
			result.errors.startDate.should.not.equal("");
			result.errors.endDate.should.not.equal("");
		});

		it("should reject a budget with start > end", () => {
			const result = validateBudget({
				...VALID_BUDGET,
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
