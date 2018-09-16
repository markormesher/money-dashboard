import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { ThinProfile } from "../../../server/model-thins/ThinProfile";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import { IRootState } from "../../redux/root";

function mapStateToProps(state: IRootState): IDashboardProps {
	return {
		activeUser: state.auth.activeUser,
	};
}

interface IDashboardProps {
	activeUser: ThinUser;
	activeProfile?: ThinProfile;
}

class Dashboard extends Component<IDashboardProps> {
	public render() {
		return (
				<div>
					<h2>Dashboard</h2>
					<p>Hello, {this.props.activeUser.displayName}!</p>
				</div>
		);
	}
}

export default connect(mapStateToProps)(Dashboard);
