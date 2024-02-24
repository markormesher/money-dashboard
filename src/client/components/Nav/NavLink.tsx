import * as React from "react";
import { Link } from "react-router-dom";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { MaterialIcon, MaterialIconName } from "../_ui/MaterialIcon/MaterialIcon";
import { sharedHistory } from "../../helpers/history";
import { NavContext } from "../App/App";
import * as style from "./Nav.scss";

type NavLinkProps = {
  readonly to: string;
  readonly text: string;
  readonly icon: MaterialIconName;
  readonly onClick?: () => void;
};

function NavLink(props: NavLinkProps): React.ReactElement {
  const { navState, setNavState } = React.useContext(NavContext);

  const onClick = () => {
    setNavState?.({ ...navState, isOpen: false });
    props.onClick?.();
  };

  const active = props.to === sharedHistory.location.pathname;
  return (
    <li className={bs.navItem}>
      <Link
        to={props.to}
        title={props.text}
        className={combine(bs.navLink, style.navLink, active && style.active)}
        onClick={onClick}
      >
        <MaterialIcon icon={props.icon} className={combine(bs.me2, style.navIcon)} />
        {props.text}
      </Link>
    </li>
  );
}

export { NavLink };
