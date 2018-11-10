import { ActionCreator } from "redux";
import { IAccountSummary } from "../../../server/model-thins/IAccountSummary";
import { PayloadAction } from "../PayloadAction";

enum DashboardActions {
	SET_ACCOUNT_SUMMARIES = "DashboardActions.SET_ACCOUNT_SUMMARIES",
	START_LOAD_ACCOUNT_SUMMARIES = "DashboardActions.START_LOAD_ACCOUNT_SUMMARIES",
}

const startLoadAccountSummaries: ActionCreator<PayloadAction> = () => {
	return { type: DashboardActions.START_LOAD_ACCOUNT_SUMMARIES };
};

const setAccountSummaries: ActionCreator<PayloadAction> = (accountSummaries: IAccountSummary[]) => {
	return {
		type: DashboardActions.SET_ACCOUNT_SUMMARIES,
		payload: { accountSummaries },
	};
};

export {
	DashboardActions,
	startLoadAccountSummaries,
	setAccountSummaries,
};
