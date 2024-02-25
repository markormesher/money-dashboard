import * as React from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { Card } from "../Card/Card";
import * as style from "./PageOptions.scss";

function PageOptions(props: React.PropsWithChildren<unknown>): React.ReactElement {
  return (
    <div className={bs.row}>
      <div className={bs.col}>
        <Card>
          <div className={style.wrapper}>{props.children}</div>
        </Card>
      </div>
    </div>
  );
}

export { PageOptions };
