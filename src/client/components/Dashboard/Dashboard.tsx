import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { ThinProfile } from "../../../server/model-thins/ThinProfile";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import * as bs from "../../bootstrap-aliases";
import { IRootState } from "../../redux/root";

interface IDashboardProps {
	activeUser: ThinUser;
	activeProfile?: ThinProfile;
}

function mapStateToProps(state: IRootState, props: IDashboardProps): IDashboardProps {
	return {
		...props,
		activeUser: state.auth.activeUser,
		activeProfile: state.auth.activeUser.profiles[state.auth.activeProfile],
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
					<h1 className={bs.h2}>Dashboard</h1>
				</div>
		);
	}
}

export default connect(mapStateToProps)(Dashboard);
