import { faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { Component, MouseEvent } from "react";
import { BrowserRouter, Link, Redirect, Route, Switch } from "react-router-dom";

import "bootstrap/dist/js/bootstrap";
import "jquery/dist/jquery";

import * as styles from "./App.scss";

import { ThinProfile } from "../../../server/model-thins/ThinProfile";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import Dashboard from "../Dashboard/Dashboard";
import Login from "../Login/Login";
import Transactions from "../Transactions/Transactions";

const initialState = {
	waitingForAuth: true,
	activeUser: undefined as ThinUser,
	activeProfile: undefined as ThinProfile,
};
type State = Readonly<typeof initialState>;

export class App extends Component<any, State> {

	public readonly state: State = initialState;

	constructor(props: any) {
		super(props);

		this.logout = this.logout.bind(this);
	}

	public componentDidMount() {
		axios.get<ThinUser>("/auth/current-user")
				.then((response: AxiosResponse<ThinUser>) => {
					if (response.data.id) {
						this.setState({
							waitingForAuth: false,
							activeUser: response.data,
							// TODO: set active profile
						});
					} else {
						this.setState({
							waitingForAuth: false,
							activeUser: undefined,
							activeProfile: undefined,
						});
					}
				})
				.catch(() => {
					this.setState({
						waitingForAuth: false,
						activeUser: undefined,
						activeProfile: undefined,
					});
				});
	}

	public logout(event: MouseEvent) {
		event.preventDefault();
		this.setState({ waitingForAuth: true });
		axios.post("/auth/logout")
				.then(() => {
					this.setState({
						waitingForAuth: false,
						activeUser: undefined,
						activeProfile: undefined,
					});
				})
				.catch(() => {
					this.setState({
						waitingForAuth: false,
					});
				});
	}

	public render() {
		if (this.state.waitingForAuth) {
			return (
					<div className={styles.waitingForAuth}>
						<FontAwesomeIcon icon={faCircleNotch} spin={true} size={"2x"}/>
					</div>
			);
		}

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
							<li><Link to="#" onClick={this.logout}>Logout</Link></li>
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
