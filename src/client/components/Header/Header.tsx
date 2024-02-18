import * as React from "react";
import { Link } from "react-router-dom";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { ProfileChooser } from "../_ui/ProfileChooser/ProfileChooser";
import { MaterialIcon, MaterialIconName } from "../_ui/MaterialIcon/MaterialIcon";
import * as style from "./Header.scss";

function Header(): React.ReactElement {
  const brandIcons: MaterialIconName[] = ["savings", "currency_pound", "account_balance", "payments"];
  const icon = brandIcons[Math.floor(Math.random() * brandIcons.length)];

  function toggleNav(): void {
    // TODO
  }

  return (
    <nav className={combine(bs.navbar, style.navbar, bs.navbarDark, bs.stickyTop, bs.flexMdNowrap, bs.p0)}>
      <div className={combine(bs.container, style.navbarContainer)}>
        <Link to="/" className={combine(bs.navbarBrand, style.navbarBrand, bs.colLg2, bs.wAuto, bs.flexGrow1)}>
          <MaterialIcon icon={icon} className={bs.me2} />
          Money Dashboard
        </Link>

        <div className={combine(bs.dNone, bs.dLgBlock)}>
          <ProfileChooser />
        </div>

        <Link to="#" onClick={toggleNav} className={combine(bs.dInlineBlock, bs.dLgNone, bs.ms2)}>
          <MaterialIcon icon={"menu"} className={style.navToggleIcon} />
        </Link>
      </div>
    </nav>
  );
}

export { Header };
