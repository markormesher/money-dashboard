import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import { startLogOutCurrentUser } from "../../redux/auth/actions";
import { IRootState } from "../../redux/root";
import Dashboard from "../Dashboard/Dashboard";
import FullPageError from "../FullPageError/FullPageError";
import FullPageSpinner from "../FullPageSpinner/FullPageSpinner";
import Login from "../Login/Login";
import { Transactions } from "../Transactions/Transactions";

import "bootstrap/dist/js/bootstrap";
import "jquery/dist/jquery";
import "./App.scss";

// TODO: any way to avoid making these all optional?
interface IAppProps {
	waitingFor?: string[];
	activeUser?: ThinUser;
	logout?: () => AnyAction;
}

function mapStateToProps(state: IRootState, props: IAppProps): IAppProps {
	return {
		...props,
		waitingFor: state.global.waitingFor,
		activeUser: state.auth.activeUser,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IAppProps): IAppProps {
	return {
		...props,
		logout: () => dispatch(startLogOutCurrentUser()),
	};
}

class App extends Component<IAppProps> {

	public render() {
		if (this.props.waitingFor.length > 0) {
			return (
					<FullPageSpinner/>
			);
		}

		if (!this.props.activeUser) {
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
					{/* TODO: extra nav, footer, etc. */}
					<div>
						<ul>
							<li><Link to="/">Dashboard</Link></li>
							<li><Link to="/transactions">Transactions</Link></li>
							<li><Link to="#" onClick={this.props.logout}>Logout</Link></li>
						</ul>

						<hr/>

						<Switch>
							<Route exact path="/" component={Dashboard}/>
							<Route path="/transactions" component={Transactions}/>
							<Route render={() => <FullPageError message={"404: Not Found"}/>}/>
						</Switch>
					</div>
				</BrowserRouter>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
