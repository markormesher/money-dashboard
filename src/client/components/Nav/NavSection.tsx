import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import * as style from "./Nav.scss";

interface INavSectionProps {
  readonly title?: string;
}

export class NavSection extends PureComponent<INavSectionProps> {
  private static sectionHeaderClasses = combine(
    bs.alignItemsCenter,
    bs.justifyContentBetween,
    bs.dFlex,
    bs.px3,
    bs.mt4,
    bs.mb1,
    bs.textMuted,
    style.navSectionHeading,
  );

  private static linkGroupClasses = combine(bs.nav, bs.flexColumn);

  public render(): ReactNode {
    return (
      <div>
        {this.props.title && <h6 className={NavSection.sectionHeaderClasses}>{this.props.title}</h6>}

        <ul className={NavSection.linkGroupClasses}>{this.props.children}</ul>
      </div>
    );
  }
}
