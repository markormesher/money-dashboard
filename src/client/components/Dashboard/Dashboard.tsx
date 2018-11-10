import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IAccountSummary } from "../../../server/model-thins/IAccountSummary";
import { ThinProfile } from "../../../server/model-thins/ThinProfile";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import { IBudgetBalance } from "../../../server/statistics/budget-statistics";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { startLoadAccountSummaries, startLoadBudgetBalances } from "../../redux/dashboard/actions";
import { IRootState } from "../../redux/root";
import { DashboardAccountList } from "./DashboardAccountList";
import { DashboardBudgetList } from "./DashboardBudgetList";

interface IDashboardProps {
	readonly activeUser: ThinUser;
	readonly activeProfile?: ThinProfile;
	readonly accountSummaries?: IAccountSummary[];
	readonly budgetBalances?: IBudgetBalance[];

	readonly actions?: {
		readonly startLoadAccountSummaries: () => AnyAction,
		readonly startLoadBudgetBalances: () => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: IDashboardProps): IDashboardProps {
	return {
		...props,
		activeUser: state.auth.activeUser,
		activeProfile: state.auth.activeUser.profiles[state.auth.activeProfile],
		accountSummaries: state.dashboard.accountSummaries,
		budgetBalances: state.dashboard.budgetBalances,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IDashboardProps): IDashboardProps {
	return {
		...props,
		actions: {
			startLoadAccountSummaries: () => dispatch(startLoadAccountSummaries()),
			startLoadBudgetBalances: () => dispatch(startLoadBudgetBalances()),
		},
	};
}

class UCDashboard extends PureComponent<IDashboardProps> {

	public componentDidMount(): void {
		this.props.actions.startLoadAccountSummaries();
		this.props.actions.startLoadBudgetBalances();
	}

	public render(): ReactNode {
		return (
				<div>
					<div className={bs.row}>
						<div className={combine(bs.colSm12, bs.colMd8)}>
							<DashboardBudgetList budgetBalances={this.props.budgetBalances}/>
						</div>
						<div className={combine(bs.colSm12, bs.colMd4)}>
							<DashboardAccountList accountSummaries={this.props.accountSummaries}/>
						</div>
					</div>
				</div>
		);
	}
}

export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(UCDashboard);
