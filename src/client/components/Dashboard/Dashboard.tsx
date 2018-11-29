import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IAccountBalance } from "../../../server/model-thins/IAccountBalance";
import { ThinProfile } from "../../../server/model-thins/ThinProfile";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import { IBudgetBalance } from "../../../server/statistics/budget-statistics";
import { ICategoryBalance } from "../../../server/statistics/category-statistics";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import {
	startLoadAccountBalances,
	startLoadBudgetBalances,
	startLoadMemoCategoryBalances,
} from "../../redux/dashboard";
import { IRootState } from "../../redux/root";
import { DashboardAccountList } from "./DashboardAccountList";
import { DashboardAlertList } from "./DashboardAlertList";
import { DashboardBudgetList } from "./DashboardBudgetList";

interface IDashboardProps {
	readonly activeUser: ThinUser;
	readonly activeProfile?: ThinProfile;
	readonly accountBalances?: IAccountBalance[];
	readonly budgetBalances?: IBudgetBalance[];
	readonly memoCategoryBalances?: ICategoryBalance[];

	readonly actions?: {
		readonly startLoadaccountBalances: () => AnyAction,
		readonly startLoadBudgetBalances: () => AnyAction,
		readonly startLoadMemoCategoryBalances: () => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: IDashboardProps): IDashboardProps {
	return {
		...props,
		activeUser: state.auth.activeUser,
		activeProfile: state.auth.activeUser.profiles[state.auth.activeProfile],
		accountBalances: state.dashboard.accountBalances,
		budgetBalances: state.dashboard.budgetBalances,
		memoCategoryBalances: state.dashboard.memoCategoryBalances,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IDashboardProps): IDashboardProps {
	return {
		...props,
		actions: {
			startLoadaccountBalances: () => dispatch(startLoadAccountBalances()),
			startLoadBudgetBalances: () => dispatch(startLoadBudgetBalances()),
			startLoadMemoCategoryBalances: () => dispatch(startLoadMemoCategoryBalances()),
		},
	};
}

class UCDashboard extends PureComponent<IDashboardProps> {

	public componentDidMount(): void {
		this.props.actions.startLoadaccountBalances();
		this.props.actions.startLoadBudgetBalances();
		this.props.actions.startLoadMemoCategoryBalances();
	}

	public render(): ReactNode {
		return (
				<div className={bs.row}>
					<div className={combine(bs.colSm12, bs.colMd8)}>
						<DashboardBudgetList budgetBalances={this.props.budgetBalances}/>
					</div>
					<div className={combine(bs.colSm12, bs.colMd4)}>
						<DashboardAlertList
								memoCategoryBalances={this.props.memoCategoryBalances}
						/>
						<DashboardAccountList accountBalances={this.props.accountBalances}/>
					</div>
				</div>
		);
	}
}

export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(UCDashboard);
