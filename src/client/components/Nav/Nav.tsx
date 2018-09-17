import {
	faAnalytics,
	faChartLine,
	faChartPie,
	faHome,
	faPiggyBank,
	faSlidersH,
	faTable,
	faUsers,
} from "@fortawesome/pro-light-svg-icons";
import { faTags } from "@fortawesome/pro-light-svg-icons/faTags";
import cn = require("classnames");
import * as React from "react";
import { Component } from "react";

import NavLink from "../NavLink/NavLink";
import { NavSection } from "../NavSection/NavSection";

import * as bs from "bootstrap/dist/css/bootstrap.css";
import * as style from "./Nav.scss";

class Nav extends Component {

	public render() {
		return (
				<nav className={cn(bs.colMd2, bs.dNone, bs.dMdBlock, bs.bgLight, style.sidebar)}>
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
					</div>
				</nav>
		);
	}
}

export default Nav;
