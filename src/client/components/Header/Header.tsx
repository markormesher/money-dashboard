import { faBars, faPoundSign } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import * as bs from "../../bootstrap-aliases";
import { combine } from "../../helpers/style-helpers";
import { closeNav, openNav } from "../../redux/nav/actions";
import { IRootState } from "../../redux/root";
import * as style from "./Header.scss";

interface IHeaderProps {
	navIsOpen?: boolean;

	actions?: {
		openNav: () => AnyAction,
		closeNav: () => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: IHeaderProps): IHeaderProps {
	return {
		...props,
		navIsOpen: state.nav.isOpen,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IHeaderProps): IHeaderProps {
	return {
		...props,
		actions: {
			openNav: () => dispatch(openNav()),
			closeNav: () => dispatch(closeNav()),
		},
	};
}

class Header extends Component<IHeaderProps> {
	constructor(props: IHeaderProps) {
		super(props);

		this.toggleNav = this.toggleNav.bind(this);
	}

	public toggleNav() {
		if (this.props.navIsOpen) {
			this.props.actions.closeNav();
		} else {
			this.props.actions.openNav();
		}
	}

	public render() {
		return (
				<nav className={combine(bs.navbar, style.navbar, bs.navbarDark, bs.stickyTop, bs.bgDark, bs.flexMdNowrap, bs.p0)}>
					<Link to="#" onClick={this.toggleNav} className={combine(bs.dInlineBlock, bs.dLgNone, bs.mx2)}>
						<FontAwesomeIcon icon={faBars} fixedWidth={true} className={style.navToggleIcon}/>
					</Link>

					<Link to="/" className={combine(bs.navbarBrand, style.navbarBrand, bs.colLg2, bs.wAuto, bs.flexGrow1)}>
						<FontAwesomeIcon icon={faPoundSign} fixedWidth={true} className={combine(bs.textMuted, bs.mr2)}/>
						Money Dashboard
					</Link>
				</nav>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
