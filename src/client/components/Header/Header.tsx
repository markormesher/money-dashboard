import { faBars, faPoundSign, faSack, faMoneyBillWave, faWallet } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { closeNav, openNav } from "../../redux/nav";
import { IRootState } from "../../redux/root";
import { ProfileChooser } from "../_ui/ProfileChooser/ProfileChooser";
import * as style from "./Header.scss";

interface IHeaderProps {
  readonly navIsOpen?: boolean;

  readonly actions?: {
    readonly openNav: () => AnyAction;
    readonly closeNav: () => AnyAction;
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
      openNav: (): AnyAction => dispatch(openNav()),
      closeNav: (): AnyAction => dispatch(closeNav()),
    },
  };
}

class UCHeader extends PureComponent<IHeaderProps> {
  private static brandIcons = [faPoundSign, faSack, faMoneyBillWave, faWallet];
  private static icon = UCHeader.brandIcons[Math.floor(Math.random() * UCHeader.brandIcons.length)];

  constructor(props: IHeaderProps) {
    super(props);

    this.toggleNav = this.toggleNav.bind(this);
  }

  public render(): ReactNode {
    return (
      <nav className={combine(bs.navbar, style.navbar, bs.navbarDark, bs.stickyTop, bs.flexMdNowrap, bs.p0)}>
        <Link to="/" className={combine(bs.navbarBrand, style.navbarBrand, bs.colLg2, bs.wAuto, bs.flexGrow1)}>
          <FontAwesomeIcon icon={UCHeader.icon} fixedWidth={true} className={bs.mr2} />
          Money Dashboard
        </Link>

        <div className={combine(bs.mr4, bs.dNone, bs.dLgBlock)}>
          <ProfileChooser />
        </div>

        <Link to="#" onClick={this.toggleNav} className={combine(bs.dInlineBlock, bs.dLgNone, bs.mx2)}>
          <FontAwesomeIcon icon={faBars} fixedWidth={true} className={style.navToggleIcon} />
        </Link>
      </nav>
    );
  }

  private toggleNav(): void {
    if (this.props.navIsOpen) {
      this.props.actions.closeNav();
    } else {
      this.props.actions.openNav();
    }
  }
}

export const Header = connect(mapStateToProps, mapDispatchToProps)(UCHeader);
