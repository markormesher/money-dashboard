import { faPoundSign } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn = require("classnames");
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import { startLogOutCurrentUser } from "../../redux/auth/actions";

import * as bs from "../../bootstrap-aliases";
import * as style from "./Header.scss";

class Header extends Component {
	public render() {
		return (
				<nav className={cn(bs.navbar, bs.navbarDark, bs.stickyTop, bs.bgDark, bs.flexMdNowrap, bs.p0)}>
					<Link to="/" className={cn(bs.navbarBrand, style.navbarBrand, bs.colSm3, bs.colMd2)}>
						<FontAwesomeIcon icon={faPoundSign} fixedWidth={true} className={cn(bs.textMuted, bs.mr3)}/>
						Money Dashboard
					</Link>
				</nav>
		);
	}
}

export default Header;
