import React, { ReactElement } from "react";
import "./loading.css";

function LoadingPanel(): ReactElement {
  return (
    <div className={"loading-panel"} aria-busy={true}>
      Loading...
    </div>
  );
}

export { LoadingPanel };
