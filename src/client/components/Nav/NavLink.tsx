import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { closeNav } from "../../redux/nav";
import { IRootState } from "../../redux/root";
import * as style from "./Nav.scss";

interface INavLinkProps {
  readonly to: string;
  readonly text: string;
  readonly icon: IconProp;
  readonly onClick?: () => void;
  readonly navIsOpen?: boolean;
  readonly currentPath?: string;

  readonly actions?: {
    readonly closeNav: () => AnyAction;
  };
}

function mapStateToProps(state: IRootState, props: INavLinkProps): INavLinkProps {
  return {
    ...props,
    navIsOpen: state.nav.isOpen,
    currentPath: state.router.location.pathname,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: INavLinkProps): INavLinkProps {
  return {
    ...props,
    actions: {
      closeNav: (): AnyAction => dispatch(closeNav()),
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

  public render(): ReactNode {
    const active = this.props.to === this.props.currentPath;
    const linkClasses = combine(bs.navLink, style.navLink, active && style.active);

    return (
      <li className={UCNavLink.linkItemClasses}>
        <Link to={this.props.to} title={this.props.text} className={linkClasses} onClick={this.handleOnClick}>
          <FontAwesomeIcon icon={this.props.icon} fixedWidth={true} className={UCNavLink.iconClasses} />
          {this.props.text}
        </Link>
      </li>
    );
  }

  private handleOnClick(): void {
    if (this.props.navIsOpen) {
      this.props.actions.closeNav();
    }

    if (this.props.onClick) {
      this.props.onClick();
    }
  }
}

export const NavLink = connect(mapStateToProps, mapDispatchToProps)(UCNavLink);
