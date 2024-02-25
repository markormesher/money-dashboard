import * as React from "react";
import bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";

function AppContentWrapper(props: React.PropsWithChildren<unknown>): React.ReactElement {
  return (
    <main role="main" className={combine(bs.colLg10, bs.msSmAuto, bs.pt3, bs.px4)}>
      <div className={combine(bs.pb2, bs.mb3)}>{props.children}</div>
    </main>
  );
}

export { AppContentWrapper };
