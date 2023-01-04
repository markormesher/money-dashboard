import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import { createBrowserHistory } from "history";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { composeWithDevTools } from "@redux-devtools/extension";
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

// NEW: contexts to replace some of the super-global redux state

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root"),
);
