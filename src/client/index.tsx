import { ConnectedRouter, connectRouter, routerMiddleware } from "connected-react-router";
import createBrowserHistory from "history/createBrowserHistory";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { App } from "./components/App/App";
import { startLoadCurrentUser } from "./redux/auth/actions";
import { rootReducer, rootSaga } from "./redux/root";

// "require" forces webpack to include entire stylesheets; "import" only works for named exports
require("./global-styles/Bootstrap.scss"); // tslint:disable-line:no-var-requires
require("./global-styles/Cuetip.scss"); // tslint:disable-line:no-var-requires
require("./global-styles/Global.scss"); // tslint:disable-line:no-var-requires

const history = createBrowserHistory();

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
		connectRouter(history)(rootReducer),
		composeWithDevTools(
				applyMiddleware(
						routerMiddleware(history),
						sagaMiddleware,
				),
		),
);

sagaMiddleware.run(rootSaga);

store.dispatch(startLoadCurrentUser());

ReactDOM.render(
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<App/>
			</ConnectedRouter>
		</Provider>,
		document.getElementById("root"),
);