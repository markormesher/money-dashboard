import { afterEach, beforeEach, describe, it } from "mocha";
import * as Moment from "moment";
import { DEFAULT_BUDGET } from "../../server/models/IBudget";
import {
	BudgetActions,
	setBudgetIdsToClone,
	setBudgetToEdit,
	setDisplayCurrentOnly,
	setEditorBusy,
	startCloneBudgets,
	startDeleteBudget,
	startSaveBudget,
} from "./budgets";

describe(__filename, () => {

	describe("startDeleteBudget()", () => {

		it("should generate an action with the correct type", () => {
			startDeleteBudget(DEFAULT_BUDGET).type.should.equal(BudgetActions.START_DELETE_BUDGET);
		});

		it("should add the budget to the payload", () => {
			startDeleteBudget(DEFAULT_BUDGET).payload.should.have.keys("budget");
			startDeleteBudget(DEFAULT_BUDGET).payload.budget.should.equal(DEFAULT_BUDGET);
		});
	});

	describe("startSaveBudget()", () => {

		it("should generate an action with the correct type", () => {
			startSaveBudget(DEFAULT_BUDGET).type.should.equal(BudgetActions.START_SAVE_BUDGET);
		});

		it("should add the budget to the payload", () => {
			startSaveBudget(DEFAULT_BUDGET).payload.should.have.keys("budget");
			startSaveBudget(DEFAULT_BUDGET).payload.budget.should.equal(DEFAULT_BUDGET);
		});
	});

	describe("startCloneBudgets()", () => {

		const ids = ["test-id"];
		const start = Moment("2018-01-01");
		const end = Moment("2018-01-02");

		it("should generate an action with the correct type", () => {
			startCloneBudgets(ids, start, end).type.should.equal(BudgetActions.START_CLONE_BUDGETS);
		});

		it("should add the budget IDs and dates to the payload", () => {
			startCloneBudgets(ids, start, end).payload.should.have.keys("budgetIds", "startDate", "endDate");
			startCloneBudgets(ids, start, end).payload.budgetIds.should.equal(ids);
			startCloneBudgets(ids, start, end).payload.startDate.should.equal(start);
			startCloneBudgets(ids, start, end).payload.endDate.should.equal(end);
		});
	});

	describe("setDisplayCurrentOnly()", () => {

		it("should generate an action with the correct type", () => {
			setDisplayCurrentOnly(true).type.should.equal(BudgetActions.SET_DISPLAY_CURRENT_ONLY);
		});

		it("should add the value to the payload", () => {
			setDisplayCurrentOnly(true).payload.should.have.keys("currentOnly");
			setDisplayCurrentOnly(true).payload.currentOnly.should.equal(true);
		});
	});

	describe("setBudgetToEdit()", () => {

		it("should generate an action with the correct type", () => {
			setBudgetToEdit(DEFAULT_BUDGET).type.should.equal(BudgetActions.SET_BUDGET_TO_EDIT);
		});

		it("should add the budget to the payload", () => {
			setBudgetToEdit(DEFAULT_BUDGET).payload.should.have.keys("budget");
			setBudgetToEdit(DEFAULT_BUDGET).payload.budget.should.equal(DEFAULT_BUDGET);
		});
	});

	describe("setBudgetIdsToClone()", () => {

		const ids = ["test-id"];

		it("should generate an action with the correct type", () => {
			setBudgetIdsToClone(ids).type.should.equal(BudgetActions.SET_BUDGETS_TO_CLONE);
		});

		it("should add the budget IDs to the payload", () => {
			setBudgetIdsToClone(ids).payload.should.have.keys("budgetIds");
			setBudgetIdsToClone(ids).payload.budgetIds.should.equal(ids);
		});
	});

	describe("setEditorBusy()", () => {

		it("should generate an action with the correct type", () => {
			setEditorBusy(true).type.should.equal(BudgetActions.SET_EDITOR_BUSY);
		});

		it("should add the value to the payload", () => {
			setEditorBusy(true).payload.should.have.keys("editorBusy");
			setEditorBusy(true).payload.editorBusy.should.equal(true);
		});
	});

	// TODO: reducer

	// TODO: sagas
});
