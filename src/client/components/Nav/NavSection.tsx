import * as React from "react";
import bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import style from "./Nav.scss";

type NavSectionProps = {
  readonly title?: string;
};

function NavSection(props: React.PropsWithChildren<NavSectionProps>): React.ReactElement {
  const sectionHeaderClasses = combine(
    bs.alignItemsCenter,
    bs.justifyContentBetween,
    bs.dFlex,
    bs.px3,
    bs.mt4,
    bs.mb1,
    style.navSectionHeading,
  );

  const linkGroupClasses = combine(bs.nav, bs.flexColumn);

  return (
    <div>
      {props.title && <h6 className={sectionHeaderClasses}>{props.title}</h6>}
      <ul className={linkGroupClasses}>{props.children}</ul>
    </div>
  );
}

export { NavSection };
