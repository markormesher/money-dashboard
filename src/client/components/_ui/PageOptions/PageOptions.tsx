import { PureComponent, ReactNode } from "react";
import * as React from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { Card } from "../Card/Card";
import * as style from "./PageOptions.scss";

class PageOptions extends PureComponent {
  public render(): ReactNode {
    return (
      <div className={bs.row}>
        <div className={bs.col}>
          <Card>
            <div className={style.wrapper}>{this.props.children}</div>
          </Card>
        </div>
      </div>
    );
  }
}

export { PageOptions };
