import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";

class AppContentWrapper extends PureComponent {
  public render(): ReactNode {
    return (
      <main role="main" className={combine(bs.colLg10, bs.msSmAuto, bs.pt3, bs.px4)}>
        <div className={combine(bs.pb2, bs.mb3)}>{this.props.children}</div>
      </main>
    );
  }
}

export { AppContentWrapper };
