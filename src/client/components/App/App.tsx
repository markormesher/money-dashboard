import { faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";

import "bootstrap/dist/js/bootstrap";
import "jquery/dist/jquery";
import { AnyAction, Dispatch } from "redux";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import { startLogOutCurrentUser } from "../../redux/auth/actions";
import { IRootState } from "../../redux/root";

import * as styles from "./App.scss";

import Dashboard from "../Dashboard/Dashboard";
import Login from "../Login/Login";
import { Transactions } from "../Transactions/Transactions";

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
					<div className={styles.waitingWrapper}>
						<FontAwesomeIcon icon={faCircleNotch} spin={true} size={"2x"}/>
						<div className={styles.debugNotes}>
							Waiting for: {JSON.stringify(this.props.waitingFor)}
						</div>
					</div>
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
							{/* TODO: 404 page */}
							<Redirect to="/"/>
						</Switch>

						<hr/>

						<pre>
							{JSON.stringify(this.props, null, 2)};
						</pre>
					</div>
				</BrowserRouter>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
