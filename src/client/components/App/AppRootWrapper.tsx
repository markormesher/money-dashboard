import * as React from "react";
import * as bs from "../../global-styles/Bootstrap.scss";

function AppRootWrapper(props: React.PropsWithChildren<unknown>): React.ReactElement {
  return (
    <div className={bs.containerFluid}>
      <div className={bs.row}>{props.children}</div>
    </div>
  );
}

export { AppRootWrapper };
