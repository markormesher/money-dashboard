import { faPiggyBank } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as FontAwesome from "react-fontawesome";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IAccountSummary } from "../../../server/model-thins/IAccountSummary";
import { ThinProfile } from "../../../server/model-thins/ThinProfile";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { startLoadAccountSummaries } from "../../redux/dashboard/actions";
import { IRootState } from "../../redux/root";
import { DashboardAccountList } from "./DashboardAccountList";

interface IDashboardProps {
	readonly activeUser: ThinUser;
	readonly activeProfile?: ThinProfile;
	readonly accountSummaries?: IAccountSummary[];

	readonly actions?: {
		readonly startLoadAccountSummaries: () => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: IDashboardProps): IDashboardProps {
	return {
		...props,
		activeUser: state.auth.activeUser,
		activeProfile: state.auth.activeUser.profiles[state.auth.activeProfile],
		accountSummaries: state.dashboard.accountSummaries,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IDashboardProps): IDashboardProps {
	return {
		...props,
		actions: {
			startLoadAccountSummaries: () => dispatch(startLoadAccountSummaries()),
		},
	};
}

class UCDashboard extends PureComponent<IDashboardProps> {

	public componentDidMount(): void {
		this.props.actions.startLoadAccountSummaries();
	}

	public render(): ReactNode {
		return (
				<div>
					<div className={bs.row}>
						<div className={combine(bs.colSm12, bs.colMd8)}>
							<p>Budgets and bills</p>
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
