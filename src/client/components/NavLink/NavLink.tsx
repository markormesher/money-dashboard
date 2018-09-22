import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn = require("classnames");
import * as React from "react";
import { Component, EventHandler } from "react";
import { StaticContext, withRouter } from "react-router";
import { Link, RouteComponentProps } from "react-router-dom";

import * as bs from "../../bootstrap-aliases";
import * as style from "./NavLink.scss";

interface INavLinkProps {
	to: string;
	text: string;
	icon: IconProp;
	onClick?: EventHandler<any>;
}

class NavLink extends Component<RouteComponentProps<void, StaticContext, void> & INavLinkProps> {

	private linkItemClasses = cn(bs.navItem);
	private iconClasses = cn(bs.mr2, bs.textMuted);

	public render() {
		const active = this.props.to === this.props.location.pathname;
		const linkClasses = cn(bs.navLink, style.navLink, (active && style.active));

		return (
				<li className={this.linkItemClasses}>
					<Link to={this.props.to} className={linkClasses} onClick={this.props.onClick}>
						<FontAwesomeIcon icon={this.props.icon} fixedWidth={true} className={this.iconClasses}/>
						{this.props.text}
					</Link>
				</li>
		);
	}
}

export default withRouter(NavLink);
