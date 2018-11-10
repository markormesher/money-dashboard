import { IAccountSummary } from "../../../server/model-thins/IAccountSummary";
import { PayloadAction } from "../PayloadAction";
import { DashboardActions } from "./actions";

interface IDashboardState {
	readonly accountSummaries?: IAccountSummary[];
}

const initialState: IDashboardState = {
	accountSummaries: undefined,
};

function dashboardReducer(state: IDashboardState = initialState, action: PayloadAction): IDashboardState {
	switch (action.type) {
		case DashboardActions.SET_ACCOUNT_SUMMARIES:
			return {
				...state,
				accountSummaries: action.payload.accountSummaries,
			};

		default:
			return state;
	}
}

export {
	IDashboardState,
	dashboardReducer,
};
