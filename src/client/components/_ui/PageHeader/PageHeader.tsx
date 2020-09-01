import { PureComponent, ReactNode } from "react";
import * as React from "react";
import { combine } from "../../../helpers/style-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";

class PageHeader extends PureComponent {
  public render(): ReactNode {
    return (
      <div className={bs.row}>
        <div className={combine(bs.col, bs.mb3)}>
          <h2>{this.props.children}</h2>
        </div>
      </div>
    );
  }
}

export { PageHeader };
