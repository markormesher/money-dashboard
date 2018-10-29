import { faBars, faPoundSign } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import { closeNav, openNav } from "../../../redux/nav/actions";
import { IRootState } from "../../../redux/root";
import * as style from "./Header.scss";

interface IHeaderProps {
	readonly nav?: {
		readonly isOpen?: boolean;
	};

	readonly actions?: {
		readonly openNav: () => AnyAction,
		readonly closeNav: () => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: IHeaderProps): IHeaderProps {
	return {
		...props,
		nav: {
			isOpen: state.nav.isOpen,
		},
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

class UCHeader extends PureComponent<IHeaderProps> {

	constructor(props: IHeaderProps) {
		super(props);

		this.toggleNav = this.toggleNav.bind(this);
	}

	public render(): ReactNode {
		return (
				<nav className={combine(bs.navbar, style.navbar, bs.navbarDark, bs.stickyTop, bs.bgDark, bs.flexMdNowrap, bs.p0)}>
					<Link to="#" onClick={this.toggleNav} className={combine(bs.dInlineBlock, bs.dLgNone, bs.mx2)}>
						<FontAwesomeIcon icon={faBars} fixedWidth={true} className={style.navToggleIcon}/>
					</Link>

					<Link
							to="/"
							className={combine(bs.navbarBrand, style.navbarBrand, bs.colLg2, bs.wAuto, bs.flexGrow1)}
					>
						<FontAwesomeIcon
								icon={faPoundSign}
								fixedWidth={true}
								className={combine(bs.textMuted, bs.mr2)}
						/>
						Money Dashboard
					</Link>
				</nav>
		);
	}

	private toggleNav(): void {
		if (this.props.nav.isOpen) {
			this.props.actions.closeNav();
		} else {
			this.props.actions.openNav();
		}
	}
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(UCHeader);
