import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter } from "react-router-dom";

import "jquery/dist/jquery"
import "bootstrap/dist/js/bootstrap"
import Dashboard from "../Dashboard/Dashboard";
import Transactions from "../Transactions/Transactions";

export class App extends Component {
	render() {
		return (
				<BrowserRouter>
					<div>
						<ul>
							<li><Link to="/">Dashboard</Link></li>
							<li><Link to="/transactions">Transactions</Link></li>
						</ul>

						<Switch>
							<Route exact path="/" component={Dashboard}/>
							<Route path="/transactions" component={Transactions}/>
						</Switch>
					</div>
				</BrowserRouter>
		);
	}
}

export default App;
