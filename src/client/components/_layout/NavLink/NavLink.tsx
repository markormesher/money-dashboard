import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component, EventHandler } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import { closeNav } from "../../../redux/nav/actions";
import { IRootState } from "../../../redux/root";
import * as style from "./NavLink.scss";

interface INavLinkProps {
	to: string;
	text: string;
	icon: IconProp;
	onClick?: EventHandler<any>;

	nav?: {
		isOpen: boolean;
	};

	router?: {
		currentPath: string;
	};

	actions?: {
		closeNav: () => AnyAction,
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

class NavLink extends Component<INavLinkProps> {

	private linkItemClasses = bs.navItem;
	private iconClasses = combine(bs.mr2, bs.textMuted);

	constructor(props: INavLinkProps) {
		super(props);

		this.handleOnClick = this.handleOnClick.bind(this);
	}

	public handleOnClick() {
		if (this.props.nav.isOpen) {
			this.props.actions.closeNav();
		}

		if (this.props.onClick) {
			this.props.onClick.call(this);
		}
	}

	public render() {
		const active = this.props.to === this.props.router.currentPath;
		const linkClasses = combine(bs.navLink, style.navLink, (active && style.active));

		return (
				<li className={this.linkItemClasses}>
					<Link
							to={this.props.to}
							title={this.props.text}
							className={linkClasses}
							onClick={this.handleOnClick}
					>
						<FontAwesomeIcon icon={this.props.icon} fixedWidth={true} className={this.iconClasses}/>
						{this.props.text}
					</Link>
				</li>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(NavLink);
