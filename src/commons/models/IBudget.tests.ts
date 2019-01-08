import { expect } from "chai";
import { describe } from "mocha";
import * as Moment from "moment";
import { DEFAULT_BUDGET, mapBudgetFromApi } from "./IBudget";

describe(__filename, () => {

	describe("mapBudgetFromApi()", () => {

		it("should return undefined for null/undefined/empty-string inputs", () => {
			expect(mapBudgetFromApi(null)).to.equal(undefined);
			expect(mapBudgetFromApi(undefined)).to.equal(undefined);

			// @ts-ignore
			expect(mapBudgetFromApi("")).to.equal(undefined);
		});

		it("should not mutate the input", () => {
			mapBudgetFromApi(DEFAULT_BUDGET).should.not.equal(DEFAULT_BUDGET);
		});

		it("should map string dates to Moment dates", () => {
			// clone the default budget and then change the dates without making typescript angry
			const budget = { ...DEFAULT_BUDGET };
			Object.defineProperty(budget, "startDate", { writable: true, value: "2018-01-01" });
			Object.defineProperty(budget, "endDate", { writable: true, value: "2018-01-31" });
			const mappedBudget = mapBudgetFromApi(budget);

			(mappedBudget.startDate instanceof Moment).should.equal(true);
			(mappedBudget.endDate instanceof Moment).should.equal(true);

			mappedBudget.startDate.isSame(Moment("2018-01-01")).should.equal(true);
			mappedBudget.endDate.isSame(Moment("2018-01-31")).should.equal(true);
		});
	});
});
