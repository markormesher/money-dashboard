import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { App } from "./components/App/App";
import { startLoadCurrentUser } from "./redux/auth";
import { rootReducers, rootSaga } from "./redux/root";

// "require" forces webpack to include entire stylesheets; "import" only works for named exports
require("./global-styles/Bootstrap.scss"); // tslint:disable-line:no-var-requires
require("./global-styles/Global.scss"); // tslint:disable-line:no-var-requires

const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  combineReducers({
    ...rootReducers,
    router: connectRouter(history),
  }),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), sagaMiddleware)),
);

CacheKeyUtil.setStore(store);

sagaMiddleware.run(rootSaga);

store.dispatch(startLoadCurrentUser());

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root") || document.createElement("div"), // div ensures a valid container exists for testing
);
