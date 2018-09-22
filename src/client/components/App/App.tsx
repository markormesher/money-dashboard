import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import { Http404Error } from "../../helpers/errors/Http404Error";
import { IRootState } from "../../redux/root";
import { AppContentWrapper } from "../AppContentWrapper/AppContentWrapper";
import { AppRootWrapper } from "../AppRootWrapper/AppRootWrapper";
import Dashboard from "../Dashboard/Dashboard";
import FullPageError from "../FullPageError/FullPageError";
import FullPageSpinner from "../FullPageSpinner/FullPageSpinner";
import Header from "../Header/Header";
import Login from "../Login/Login";
import Nav from "../Nav/Nav";
import Transactions from "../Transactions/Transactions";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "jquery/dist/jquery";

// TODO: any way to avoid making these all optional?
interface IAppProps {
	global?: {
		waitingFor: string[];
		error: Error;
	};

	auth?: {
		activeUser: ThinUser;
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
					<div>
						<Header/>
						<AppRootWrapper>
							<Nav/>
							<AppContentWrapper>
								<Switch>
									<Route exact path="/" component={Dashboard}/>
									<Route path="/transactions" component={Transactions}/>

									{/* TODO: when rendering the 404, disable all the other UI elements */}
									<Route render={() => (<FullPageError error={new Http404Error()}/>)}/>
								</Switch>
							</AppContentWrapper>
						</AppRootWrapper>
					</div>
				</BrowserRouter>
		);
	}
}

export default connect(mapStateToProps)(App);
