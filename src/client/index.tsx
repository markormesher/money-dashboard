import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router } from "react-router";
import { sharedHistory } from "./helpers/history";
import { App } from "./components/App/App";

// "require" forces webpack to include entire stylesheets; "import" only works for named exports
require("./global-styles/Bootstrap.scss"); // tslint:disable-line:no-var-requires
require("./global-styles/Global.scss"); // tslint:disable-line:no-var-requires

ReactDOM.render(
  <Router history={sharedHistory}>
    <App />
  </Router>,
  document.getElementById("root"),
);
