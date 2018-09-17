import cn = require("classnames");
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import { startLogOutCurrentUser } from "../../redux/auth/actions";

import * as bs from "bootstrap/dist/css/bootstrap.css";
import * as style from "./Header.scss";

interface IHeaderProps {
	actions?: {
		logout: () => AnyAction,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IHeaderProps): IHeaderProps {
	return {
		...props,
		actions: {
			logout: () => dispatch(startLogOutCurrentUser()),
		},
	};
}

class Header extends Component<IHeaderProps> {
	public render() {
		return (
				<nav className={cn(bs.navbar, bs.navbarDark, bs.stickyTop, bs.bgDark, bs.flexMdNowrap, bs.p0)}>
					<Link to="/"
						  className={cn(bs.navbarBrand, style.navbarBrand, bs.colSm3, bs.colMd2, bs.mr0)}>
						Money Dashboard
					</Link>
					<ul className={cn(bs.navbarNav, bs.px3)}>
						<li className={cn(bs.navItem, bs.textNowrap)}>
							<Link to="#" className={bs.navLink} onClick={this.props.actions.logout}>
								Logout
							</Link>
						</li>
					</ul>
				</nav>
		);
	}
}

export default connect(undefined, mapDispatchToProps)(Header);
