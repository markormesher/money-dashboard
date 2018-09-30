import {
	faAnalytics,
	faChartLine,
	faChartPie,
	faHome,
	faPiggyBank, faSignOut,
	faSlidersH,
	faTable,
	faTags,
	faUsers,
} from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import * as bs from "../../bootstrap-aliases";
import { combine } from "../../helpers/style-helpers";
import { startLogOutCurrentUser } from "../../redux/auth/actions";
import { IRootState } from "../../redux/root";
import NavLink from "../NavLink/NavLink";
import { NavSection } from "../NavSection/NavSection";
import * as style from "./Nav.scss";

interface INavProps {
	isOpen?: boolean;

	actions?: {
		logout: () => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: INavProps): INavProps {
	return {
		...props,
		isOpen: state.nav.isOpen,
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
		const isOpen = this.props.isOpen;
		const wrapperClasses = combine(
				(isOpen || bs.dNone), bs.dLgBlock,
				bs.col12, bs.colLg2,
				bs.p0, bs.bgLight, style.sidebar,
		);

		return (
				<nav className={wrapperClasses}>
					<div className={style.sidebarSticky}>
						<NavSection>
							<NavLink to="/" text="Dashboard" icon={faHome}/>
							<NavLink to="/transactions" text="Transactions" icon={faTable}/>
						</NavSection>

						<NavSection title="Reports">
							<NavLink to="/reports/balance-growth" text="Balance Growth" icon={faChartLine}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Nav);
