import cn = require("classnames");
import * as React from "react";
import { Component } from "react";
import { Link } from "react-router-dom";

import * as bs from "bootstrap/dist/css/bootstrap.css";
import * as style from "./Nav.scss";

export class Nav extends Component {
	private sectionHeaderClasses = cn(
			bs.alignItemsCenter, bs.justifyContentBetween,
			bs.dFlex, bs.px3, bs.mt4, bs.mb1,
			bs.textMuted, style.sidebarHeading,
	);
	private linkGroupClasses = cn(bs.nav, bs.flexColumn);
	private linkItemClasses = cn(bs.navItem);
	private linkClasses = cn(bs.navLink, style.navLink);
	private activeLinkClasses = cn(bs.navLink, style.navLink, style.active);

	public render() {
		return (
				<nav className={cn(bs.colMd2, bs.dNone, bs.dMdBlock, bs.bgLight, style.sidebar)}>
					<div className={style.sidebarSticky}>
						<ul className={this.linkGroupClasses}>
							<li className={this.linkItemClasses}>
								<Link to="/" className={this.linkClasses}>
									{/* ICON */}
									Dashboardd
								</Link>
							</li>
						</ul>

						<h6 className={this.sectionHeaderClasses}>
							<span>Reports</span>
						</h6>

						<ul className={this.linkGroupClasses}>
							<li className={this.linkItemClasses}>
								<Link to="/transactions" className={this.linkClasses}>
									{/* ICON */}
									Transactions
								</Link>
							</li>
						</ul>
					</div>
				</nav>
		);
	}
}
