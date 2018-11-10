import { IAccountSummary } from "../../../server/model-thins/IAccountSummary";
import { IBudgetBalance } from "../../../server/statistics/budget-statistics";
import { PayloadAction } from "../PayloadAction";
import { DashboardActions } from "./actions";

interface IDashboardState {
	readonly accountSummaries?: IAccountSummary[];
	readonly budgetBalances?: IBudgetBalance[];
}

const initialState: IDashboardState = {
	accountSummaries: undefined,
	budgetBalances: undefined,
};

function dashboardReducer(state: IDashboardState = initialState, action: PayloadAction): IDashboardState {
	switch (action.type) {
		case DashboardActions.SET_ACCOUNT_SUMMARIES:
			return {
				...state,
				accountSummaries: action.payload.accountSummaries,
			};

		case DashboardActions.SET_BUDGET_BALANCES:
			return {
				...state,
				budgetBalances: action.payload.budgetBalances,
			};

		default:
			return state;
	}
}

export {
	IDashboardState,
	dashboardReducer,
};
