import * as React from "react";
import { Component } from "react";
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";

import "bootstrap/dist/js/bootstrap";
import "jquery/dist/jquery";

import { ThinProfile } from "../../../server/model-thins/ThinProfile";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import Dashboard from "../Dashboard/Dashboard";
import Login from "../Login/Login";
import Transactions from "../Transactions/Transactions";

const initialState = {
	activeUser: undefined as ThinUser,
	activeProfile: undefined as ThinProfile,
};
type State = Readonly<typeof initialState>;

export class App extends Component {

	public readonly state: State = initialState;

	public render() {
		if (!this.state.activeUser) {
			return (
					<BrowserRouter>
						<Switch>
							<Route exact path="/auth/login" component={Login}/>
							<Redirect to="/auth/login"/>
						</Switch>
					</BrowserRouter>
			);
		}

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
