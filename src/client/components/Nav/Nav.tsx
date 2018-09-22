import {
	faAnalytics,
	faChartLine,
	faChartPie,
	faHome,
	faPiggyBank, faSignOut,
	faSlidersH,
	faTable,
	faUsers,
} from "@fortawesome/pro-light-svg-icons";
import { faTags } from "@fortawesome/pro-light-svg-icons/faTags";
import cn = require("classnames");
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { startLogOutCurrentUser } from "../../redux/auth/actions";
import NavLink from "../NavLink/NavLink";
import { NavSection } from "../NavSection/NavSection";

import * as bs from "../../bootstrap-aliases";
import * as style from "./Nav.scss";

interface INavProps {
	actions?: {
		logout: () => AnyAction,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: INavProps): INavProps {
	return {
		...props,
		actions: {
			logout: () => dispatch(startLogOutCurrentUser()),
		},
	};
}

class Nav extends Component<INavProps> {

	public render() {
		return (
				<nav className={cn(bs.colMd2, bs.dNone, bs.dMdBlock, bs.p0, bs.bgLight, style.sidebar)}>
					<div className={style.sidebarSticky}>
						<NavSection>
							<NavLink to="/" text="Dashboard" icon={faHome}/>
							<NavLink to="/transactions" text="Transactions" icon={faTable}/>
						</NavSection>

						<NavSection title="Reports">
							<NavLink to="/reports/balance-graph" text="Balance Graph" icon={faChartLine}/>
							<NavLink to="/reports/asset-growth" text="Asset Growth" icon={faAnalytics}/>
							<NavLink to="/reports/budget-performance" text="Budget Performance" icon={faChartPie}/>
						</NavSection>

						<NavSection title="Settings">
							<NavLink to="/settings/accounts" text="Accounts" icon={faPiggyBank}/>
							<NavLink to="/settings/budgets" text="Budgets" icon={faSlidersH}/>
							<NavLink to="/settings/categories" text="Categories" icon={faTags}/>
							<NavLink to="/settings/profiles" text="Profiles" icon={faUsers}/>
						</NavSection>

						<NavSection title="Account">
							<NavLink to="#" text="Logout" icon={faSignOut} onClick={this.props.actions.logout}/>
						</NavSection>

					</div>
				</nav>
		);
	}
}

export default connect(undefined, mapDispatchToProps)(Nav);
