import { describe } from "mocha";
import * as Moment from "moment";
import { DbBudget } from "./DbBudget";
import { DbCategory } from "./DbCategory";
import { DbProfile } from "./DbProfile";

describe(__filename, () => {

	describe("clone()", () => {

		it("should create a new object", () => {
			const budget = new DbBudget();
			const clonedBudget = budget.clone();
			budget.should.not.equal(clonedBudget);
		});

		it("should copy all properties (excluding ID)", () => {
			const budget = new DbBudget();
			budget.id = "id";
			budget.type = "budget";
			budget.amount = 0;
			budget.startDate = Moment("2018-01-01");
			budget.endDate = Moment("2018-01-31");
			budget.category = new DbCategory();
			budget.profile = new DbProfile();
			budget.deleted = false;

			const clonedBudget = budget.clone();

			budget.id.should.not.equal(clonedBudget.id);
			budget.type.should.equal(clonedBudget.type);
			budget.amount.should.equal(clonedBudget.amount);
			budget.startDate.should.equal(clonedBudget.startDate);
			budget.endDate.should.equal(clonedBudget.endDate);
			budget.category.should.equal(clonedBudget.category);
			budget.profile.should.equal(clonedBudget.profile);
			budget.deleted.should.equal(clonedBudget.deleted);
		});
	});
});
