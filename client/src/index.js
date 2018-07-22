import React from 'react';
import ReactDOM from 'react-dom';
import BrowserRouter from "react-router-dom/es/BrowserRouter";
import './index.css';
import App from './components/App/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
		<BrowserRouter>
			<App/>
		</BrowserRouter>
), document.getElementById('root'));

if (process.env.ENV === "dev") {
	registerServiceWorker();
}
