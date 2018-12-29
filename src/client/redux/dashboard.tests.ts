import { describe, it } from "mocha";
import { DEFAULT_ACCOUNT } from "../../commons/models/IAccount";
import { IAccountBalance } from "../../commons/models/IAccountBalance";
import { DEFAULT_BUDGET } from "../../commons/models/IBudget";
import { IBudgetBalance } from "../../commons/models/IBudgetBalance";
import { DEFAULT_CATEGORY } from "../../commons/models/ICategory";
import { ICategoryBalance } from "../../commons/models/ICategoryBalance";
import {
	DashboardActions,
	dashboardReducer,
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

	describe("dashboardReducer()", () => {

		it("should initialise its state correctly", () => {
			dashboardReducer(undefined, { type: "@@INIT" }).should.deep.equal({
				accountBalances: undefined,
				budgetBalances: undefined,
				memoCategoryBalances: undefined,
			});
		});

		describe(DashboardActions.SET_ACCOUNT_BALANCES, () => {

			const accountBalances: IAccountBalance[] = [{ account: DEFAULT_ACCOUNT, balance: 0 }];

			it("should set the account balances", () => {
				dashboardReducer(undefined, setAccountBalances(accountBalances))
						.accountBalances.should.equal(accountBalances);
			});
		});

		describe(DashboardActions.SET_BUDGET_BALANCES, () => {

			const budgetBalances: IBudgetBalance[] = [{ budget: DEFAULT_BUDGET, balance: 0 }];

			it("should set the budget balances", () => {
				dashboardReducer(undefined, setBudgetBalances(budgetBalances))
						.budgetBalances.should.equal(budgetBalances);
			});
		});

		describe(DashboardActions.SET_MEMO_CATEGORY_BALANCES, () => {

			const categoryBalances: ICategoryBalance[] = [{ category: DEFAULT_CATEGORY, balance: 0 }];

			it("should set the memo category balances", () => {
				dashboardReducer(undefined, setMemoCategoryBalances(categoryBalances))
						.memoCategoryBalances.should.equal(categoryBalances);
			});
		});
	});

	// TODO: sagas
});
