import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { composeWithDevTools } from "@redux-devtools/extension";
import { sharedHistory } from "./helpers/history";
import { App } from "./components/App/App";
import { rootReducers, rootSaga } from "./redux/root";

// "require" forces webpack to include entire stylesheets; "import" only works for named exports
require("./global-styles/Bootstrap.scss"); // tslint:disable-line:no-var-requires
require("./global-styles/Global.scss"); // tslint:disable-line:no-var-requires

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({
    ...rootReducers,
    router: connectRouter(sharedHistory),
  }),
  composeWithDevTools(applyMiddleware(routerMiddleware(sharedHistory), sagaMiddleware)),
);

CacheKeyUtil.setStore(store);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={sharedHistory}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root"),
);
