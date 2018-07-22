import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from '../Dashboard/Dashboard';
import Transactions from "../Transactions/Transactions";

import './App.scss';
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

class App extends Component {

	render = () => (
			<div>
				<Header/>
				<Sidebar/>
				<main>
					<Switch>
						<Route exact path="/" component={Dashboard}/>
						<Route path="/transactions" component={Transactions}/>
					</Switch>
				</main>
			</div>
	)
}

export default App;
