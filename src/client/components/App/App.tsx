import * as React from "react";
import { Component } from "react";
import * as Loadable from "react-loadable";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import Http404Error from "../../helpers/errors/Http404Error";
import { IRootState } from "../../redux/root";
import AppContentWrapper from "../_layout/AppContentWrapper/AppContentWrapper";
import AppRootWrapper from "../_layout/AppRootWrapper/AppRootWrapper";
import FullPageSpinner from "../_layout/FullPageSpinner/FullPageSpinner";
import Header from "../_layout/Header/Header";
import Nav from "../_layout/Nav/Nav";
import AccountSettings from "../AccountSettings/AccountSettings";
import AssetGrowthReport from "../AssetGrowthReport/AssetGrowthReport";
import BalanceGrowthReport from "../BalanceGrowthReport/BalanceGrowthReport";
import BudgetSettings from "../BudgetSettings/BudgetSettings";
import CategorySettings from "../CategorySettings/CategorySettings";
import Dashboard from "../Dashboard/Dashboard";
import ErrorPage from "../ErrorPage/ErrorPage";
import ProfileSettings from "../ProfileSettings/ProfileSettings";
import Transactions from "../Transactions/Transactions";
import "./App.scss";

// TODO: remove lambdas in JSX (++perf)
// TODO: rewire some components to be pure components
// TODO: implement shouldComponentUpdate() where sensible

interface IAppProps {
	waitingFor?: string[];
	globalError?: Error;
	activeUser?: ThinUser;
	currentPath?: string;
}

function mapStateToProps(state: IRootState, props: IAppProps): IAppProps {
	return {
		...props,
		waitingFor: state.global.waitingFor,
		globalError: state.global.error,
		activeUser: state.auth.activeUser,
		currentPath: state.router.location.pathname,
	};
}

// most sessions will never see this, so lazy load it
const LoadableLogin = Loadable({
	loader: () => import(/* webpackChunkName: "login" */ "../Login/Login"),
	loading: () => (<FullPageSpinner/>),
});

class App extends Component<IAppProps> {

	public render() {
		const { waitingFor, globalError, activeUser, currentPath } = this.props;

		if (globalError) {
			return (
					<ErrorPage error={globalError} fullPage={true}/>
			);
		}

		if (waitingFor.length > 0) {
			return (
					<FullPageSpinner/>
			);
		}

		if (!activeUser) {
			return (
					<Switch>
						<Route exact={true} path="/auth/login" component={LoadableLogin}/>
						<Redirect to="/auth/login"/>
					</Switch>
			);
		}

		return (
				<div>
					<Header/>
					<AppRootWrapper>
						<Nav/>
						<AppContentWrapper>
							<Switch>
								<Route exact={true} path="/" component={Dashboard}/>
								<Route path="/transactions" component={Transactions}/>

								<Route path="/reports/balance-growth" component={BalanceGrowthReport}/>
								<Route path="/reports/asset-growth" component={AssetGrowthReport}/>

								<Route path="/settings/accounts" component={AccountSettings}/>
								<Route path="/settings/budgets" component={BudgetSettings}/>
								<Route path="/settings/categories" component={CategorySettings}/>
								<Route path="/settings/profiles" component={ProfileSettings}/>

								{/* Adding a new route? Keep it above this one! */}
								<Route
										render={() => {
											const error = new Http404Error(currentPath);
											return (
													<ErrorPage error={error}/>
											);
										}}
								/>
							</Switch>
						</AppContentWrapper>
					</AppRootWrapper>
				</div>
		);
	}
}

export default connect(mapStateToProps)(App);
