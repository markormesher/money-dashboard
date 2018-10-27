import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { EventHandler, PureComponent } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import { closeNav } from "../../../redux/nav/actions";
import { IRootState } from "../../../redux/root";
import * as style from "./NavLink.scss";

interface INavLinkProps {
	readonly to: string;
	readonly text: string;
	readonly icon: IconProp;
	readonly onClick?: EventHandler<any>;

	readonly nav?: {
		readonly isOpen: boolean;
	};

	readonly router?: {
		readonly currentPath: string;
	};

	readonly actions?: {
		readonly closeNav: () => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: INavLinkProps): INavLinkProps {
	return {
		...props,
		nav: {
			isOpen: state.nav.isOpen,
		},
		router: {
			currentPath: state.router.location.pathname,
		},
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: INavLinkProps): INavLinkProps {
	return {
		...props,
		actions: {
			closeNav: () => dispatch(closeNav()),
		},
	};
}

class UCNavLink extends PureComponent<INavLinkProps> {

	private static linkItemClasses = bs.navItem;
	private static iconClasses = combine(bs.mr2, bs.textMuted);

	constructor(props: INavLinkProps) {
		super(props);

		this.handleOnClick = this.handleOnClick.bind(this);
	}

	public render() {
		const active = this.props.to === this.props.router.currentPath;
		const linkClasses = combine(bs.navLink, style.navLink, (active && style.active));

		return (
				<li className={UCNavLink.linkItemClasses}>
					<Link
							to={this.props.to}
							title={this.props.text}
							className={linkClasses}
							onClick={this.handleOnClick}
					>
						<FontAwesomeIcon
								icon={this.props.icon}
								fixedWidth={true}
								className={UCNavLink.iconClasses}
						/>
						{this.props.text}
					</Link>
				</li>
		);
	}

	private handleOnClick() {
		if (this.props.nav.isOpen) {
			this.props.actions.closeNav();
		}

		if (this.props.onClick) {
			this.props.onClick.call(this);
		}
	}
}

export const NavLink = connect(mapStateToProps, mapDispatchToProps)(UCNavLink);
