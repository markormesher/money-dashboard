import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import App from "./components/App/App";
import { startLoadCurrentUser } from "./redux/auth/actions";
import { rootReducer, rootSaga } from "./redux/root";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
		rootReducer,
		(window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
		applyMiddleware(sagaMiddleware),
);

sagaMiddleware.run(rootSaga);

store.dispatch(startLoadCurrentUser());

ReactDOM.render(
		<Provider store={store}>
			<App/>
		</Provider>,
		document.getElementById("root"),
);
