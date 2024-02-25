import * as React from "react";
import { combine } from "../../../helpers/style-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import * as style from "./PageHeader.scss";

function PageHeader(props: React.PropsWithChildren<unknown>): React.ReactElement {
  return (
    <div className={bs.row}>
      <div className={combine(bs.col, bs.mb3, style.pageHeader)}>{props.children}</div>
    </div>
  );
}

function PageHeaderActions(props: React.PropsWithChildren<unknown>): React.ReactElement {
  return <div className={style.actions}>{props.children}</div>;
}

export { PageHeader, PageHeaderActions };
