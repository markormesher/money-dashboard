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
