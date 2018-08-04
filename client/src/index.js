import React from "react";
import ReactDOM from "react-dom";
import BrowserRouter from "react-router-dom/es/BrowserRouter";

import App from "./components/App/App";
import registerServiceWorker from "./registerServiceWorker";

import "./index.css";

ReactDOM.render((
		<BrowserRouter>
			<App/>
		</BrowserRouter>
), document.getElementById("root"));

registerServiceWorker();
