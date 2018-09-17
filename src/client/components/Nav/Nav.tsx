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

import * as bs from "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "../NavLink/NavLink";
import { NavSection } from "../NavSection/NavSection";
import * as style from "./Nav.scss";

export class Nav extends Component {
	public render() {
		return (
				<nav className={cn(bs.colMd2, bs.dNone, bs.dMdBlock, bs.bgLight, style.sidebar)}>
					<div className={style.sidebarSticky}>
						<NavSection>
							<NavLink to="/" text="Dashboard" icon={faHome}/>
							<NavLink to="/transactions" text="Transactions" icon={faTable}/>
						</NavSection>

						<NavSection title="Reports">
							<NavLink to="/transactions" text="Balance Graph" icon={faChartLine}/>
							<NavLink to="/transactions" text="Asset Growth" icon={faAnalytics}/>
							<NavLink to="/transactions" text="Budget Performance" icon={faChartPie}/>
						</NavSection>

						<NavSection title="Settings">
							<NavLink to="/transactions" text="Accounts" icon={faPiggyBank}/>
							<NavLink to="/transactions" text="Budgets" icon={faSlidersH}/>
							<NavLink to="/transactions" text="Categories" icon={faTags}/>
							<NavLink to="/transactions" text="Profiles" icon={faUsers}/>
						</NavSection>
					</div>
				</nav>
		);
	}
}
