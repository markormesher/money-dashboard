import { PureComponent, ReactNode } from "react";
import * as React from "react";
import { combine } from "../../../helpers/style-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import * as style from "./PageHeader.scss";

class PageHeader extends PureComponent {
  public render(): ReactNode {
    return (
      <div className={bs.row}>
        <div className={combine(bs.col, bs.mb3, style.pageHeader)}>{this.props.children}</div>
      </div>
    );
  }
}

class PageHeaderActions extends PureComponent {
  public render(): ReactNode {
    return <div className={style.actions}>{this.props.children}</div>;
  }
}

export { PageHeader, PageHeaderActions };
