import { IAccountSummary } from "../../../server/model-thins/IAccountSummary";
import { IBudgetBalance } from "../../../server/statistics/budget-statistics";
import { ICategoryBalance } from "../../../server/statistics/category-statistics";
import { PayloadAction } from "../PayloadAction";
import { DashboardActions } from "./actions";

interface IDashboardState {
	readonly accountSummaries?: IAccountSummary[];
	readonly budgetBalances?: IBudgetBalance[];
	readonly memoCategoryBalances?: ICategoryBalance[];
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

		case DashboardActions.SET_MEMO_CATEGORY_BALANCES:
			return {
				...state,
				memoCategoryBalances: action.payload.memoCategoryBalances,
			};

		default:
			return state;
	}
}

export {
	IDashboardState,
	dashboardReducer,
};
