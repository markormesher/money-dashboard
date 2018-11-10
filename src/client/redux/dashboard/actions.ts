import { ActionCreator } from "redux";
import { IAccountSummary } from "../../../server/model-thins/IAccountSummary";
import { IBudgetBalance } from "../../../server/statistics/budget-statistics";
import { PayloadAction } from "../PayloadAction";

enum DashboardActions {
	START_LOAD_ACCOUNT_SUMMARIES = "DashboardActions.START_LOAD_ACCOUNT_SUMMARIES",
	START_LOAD_BUDGET_BALANCES = "DashboardActions.START_LOAD_BUDGET_BALANCES",
	SET_ACCOUNT_SUMMARIES = "DashboardActions.SET_ACCOUNT_SUMMARIES",
	SET_BUDGET_BALANCES = "DashboardActions.SET_BUDGET_BALANCES",
}

const startLoadAccountSummaries: ActionCreator<PayloadAction> = () => {
	return { type: DashboardActions.START_LOAD_ACCOUNT_SUMMARIES };
};

const startLoadBudgetBalances: ActionCreator<PayloadAction> = () => {
	return { type: DashboardActions.START_LOAD_BUDGET_BALANCES };
};

const setAccountSummaries: ActionCreator<PayloadAction> = (accountSummaries: IAccountSummary[]) => {
	return {
		type: DashboardActions.SET_ACCOUNT_SUMMARIES,
		payload: { accountSummaries },
	};
};

const setBudgetBalances: ActionCreator<PayloadAction> = (budgetBalances: IBudgetBalance[]) => {
	return {
		type: DashboardActions.SET_BUDGET_BALANCES,
		payload: { budgetBalances },
	};
};

export {
	DashboardActions,
	startLoadAccountSummaries,
	startLoadBudgetBalances,
	setAccountSummaries,
	setBudgetBalances,
};
