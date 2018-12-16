import { afterEach, beforeEach, describe, it } from "mocha";
import { DEFAULT_ACCOUNT } from "../../server/models/IAccount";
import { DEFAULT_BUDGET } from "../../server/models/IBudget";
import { DEFAULT_CATEGORY } from "../../server/models/ICategory";
import {
	DashboardActions,
	setAccountBalances,
	setBudgetBalances,
	setMemoCategoryBalances,
	startLoadAccountBalances,
	startLoadBudgetBalances,
	startLoadMemoCategoryBalances,
} from "./dashboard";

describe(__filename, () => {

	describe("startLoadAccountBalances()", () => {

		it("should generate an action with the correct type", () => {
			startLoadAccountBalances().type.should.equal(DashboardActions.START_LOAD_ACCOUNT_BALANCES);
		});
	});

	describe("startLoadBudgetBalances()", () => {

		it("should generate an action with the correct type", () => {
			startLoadBudgetBalances().type.should.equal(DashboardActions.START_LOAD_BUDGET_BALANCES);
		});
	});

	describe("startLoadMemoCategoryBalances()", () => {

		it("should generate an action with the correct type", () => {
			startLoadMemoCategoryBalances().type.should.equal(DashboardActions.START_LOAD_MEMO_CATEGORY_BALANCES);
		});
	});

	describe("setAccountBalances()", () => {

		const accountBalances = [{
			account: DEFAULT_ACCOUNT,
			balance: 0,
		}];

		it("should generate an action with the correct type", () => {
			setAccountBalances(accountBalances).type.should.equal(DashboardActions.SET_ACCOUNT_BALANCES);
		});

		it("should add the balances to the payload", () => {
			setAccountBalances(accountBalances).payload.should.have.keys("accountBalances");
			setAccountBalances(accountBalances).payload.accountBalances.should.equal(accountBalances);
		});
	});

	describe("setBudgetBalances()", () => {

		const budgetBalances = [{
			budget: DEFAULT_BUDGET,
			balance: 0,
		}];

		it("should generate an action with the correct type", () => {
			setBudgetBalances(budgetBalances).type.should.equal(DashboardActions.SET_BUDGET_BALANCES);
		});

		it("should add the balances to the payload", () => {
			setBudgetBalances(budgetBalances).payload.should.have.keys("budgetBalances");
			setBudgetBalances(budgetBalances).payload.budgetBalances.should.equal(budgetBalances);
		});
	});

	describe("setMemoCategoryBalances()", () => {

		const categoryBalances = [{
			category: DEFAULT_CATEGORY,
			balance: 0,
		}];

		it("should generate an action with the correct type", () => {
			setMemoCategoryBalances(categoryBalances).type.should.equal(DashboardActions.SET_MEMO_CATEGORY_BALANCES);
		});

		it("should add the balances to the payload", () => {
			setMemoCategoryBalances(categoryBalances).payload.should.have.keys("memoCategoryBalances");
			setMemoCategoryBalances(categoryBalances).payload.memoCategoryBalances.should.equal(categoryBalances);
		});
	});
});
