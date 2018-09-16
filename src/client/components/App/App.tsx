import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";
import { AnyAction, Dispatch } from "redux";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import { Http404Error } from "../../helpers/errors/Http404Error";
import { startLogOutCurrentUser } from "../../redux/auth/actions";
import { IRootState } from "../../redux/root";
import Dashboard from "../Dashboard/Dashboard";
import FullPageError from "../FullPageError/FullPageError";
import FullPageSpinner from "../FullPageSpinner/FullPageSpinner";
import Login from "../Login/Login";
import Transactions from "../Transactions/Transactions";

import "bootstrap/dist/js/bootstrap";
import "jquery/dist/jquery";
import "./App.scss";

// TODO: any way to avoid making these all optional?
interface IAppProps {
	global?: {
		waitingFor: string[];
		error: Error;
	};

	auth?: {
		activeUser: ThinUser;
	};

	actions?: {
		logout: () => AnyAction;
	};
}

function mapStateToProps(state: IRootState, props: IAppProps): IAppProps {
	return {
		...props,
		global: {
			waitingFor: state.global.waitingFor,
			error: state.global.error,
		},
		auth: {
			activeUser: state.auth.activeUser,
		},
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IAppProps): IAppProps {
	return {
		...props,
		actions: {
			logout: () => dispatch(startLogOutCurrentUser()),
		},
	};
}

class App extends Component<IAppProps> {

	public render() {
		if (this.props.global.error) {
			return (
					<FullPageError error={this.props.global.error}/>
			);
		}

		if (this.props.global.waitingFor.length > 0) {
			return (
					<FullPageSpinner/>
			);
		}

		if (!this.props.auth.activeUser) {
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
					{/* TODO: extract nav, footer, etc. */}
					<div>
						<ul>
							<li><Link to="/">Dashboard</Link></li>
							<li><Link to="/transactions">Transactions</Link></li>
							<li><Link to="#" onClick={this.props.actions.logout}>Logout</Link></li>
						</ul>

						<hr/>

						<Switch>
							<Route exact path="/" component={Dashboard}/>
							<Route path="/transactions" component={Transactions}/>

							{/* TODO: when rendering the 404, disable all the other UI elements */}
							<Route render={() => (<FullPageError error={new Http404Error()}/>)}/>
						</Switch>
					</div>
				</BrowserRouter>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
