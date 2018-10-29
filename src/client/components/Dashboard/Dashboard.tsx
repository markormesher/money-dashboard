import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { ThinProfile } from "../../../server/model-thins/ThinProfile";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import * as bs from "../../bootstrap-aliases";
import { IRootState } from "../../redux/root";

interface IDashboardProps {
	readonly activeUser: ThinUser;
	readonly activeProfile?: ThinProfile;
}

function mapStateToProps(state: IRootState, props: IDashboardProps): IDashboardProps {
	return {
		...props,
		activeUser: state.auth.activeUser,
		activeProfile: state.auth.activeUser.profiles[state.auth.activeProfile],
	};
}

interface IDashboardProps {
	readonly activeUser: ThinUser;
	readonly activeProfile?: ThinProfile;
}

class UCDashboard extends PureComponent<IDashboardProps> {

	public render(): ReactNode {
		return (
				<div>
					<h1 className={bs.h2}>Dashboard</h1>
					<p>Hello, {this.props.activeUser.displayName}.</p>
				</div>
		);
	}
}

export const Dashboard = connect(mapStateToProps)(UCDashboard);
