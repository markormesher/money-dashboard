import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn = require("classnames");
import * as React from "react";
import { Component } from "react";
import { Link } from "react-router-dom";

import * as bs from "bootstrap/dist/css/bootstrap.css";
import * as style from "./NavLink.scss";

interface INavLinkProps {
	to: string;
	text: string;
	icon: IconProp;
}

export class NavLink extends Component<INavLinkProps> {
	private linkItemClasses = cn(bs.navItem);
	private linkClasses = cn(bs.navLink, style.navLink);
	private activeLinkClasses = cn(bs.navLink, style.navLink, style.active);
	private iconClasses = cn(bs.mr2, bs.textMuted);

	public render() {
		return (
				<li className={this.linkItemClasses}>
					<Link to={this.props.to} className={this.linkClasses}> {/* TODO: active link? */}
						<FontAwesomeIcon icon={this.props.icon} fixedWidth={true} className={this.iconClasses}/>
						{this.props.text}
					</Link>
				</li>
		);
	}
}
