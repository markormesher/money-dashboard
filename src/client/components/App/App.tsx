import "bootstrap/dist/css/bootstrap.css";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import Http404Error from "../../helpers/errors/Http404Error";
import { IRootState } from "../../redux/root";
import AssetGrowth from "../_reports/AssetGrowth/AssetGrowth";
import BalanceGrowth from "../_reports/BalanceGrowth/BalanceGrowth";
import BudgetPerformance from "../_reports/BudgetPerformace/BudgetPerformance";
import Accounts from "../_settings/Accounts/Accounts";
import Budgets from "../_settings/Budgets/Budgets";
import Categories from "../_settings/Categories/Categories";
import Profiles from "../_settings/Profiles/Profiles";
import AppContentWrapper from "../_layout/AppContentWrapper/AppContentWrapper";
import AppRootWrapper from "../_layout/AppRootWrapper/AppRootWrapper";
import Dashboard from "../Dashboard/Dashboard";
import ErrorPage from "../ErrorPage/ErrorPage";
import FullPageSpinner from "../_layout/FullPageSpinner/FullPageSpinner";
import Header from "../_layout/Header/Header";
import Login from "../Login/Login";
import Nav from "../_layout/Nav/Nav";
import Transactions from "../Transactions/Transactions";
import "./App.scss";

// TODO: any way to avoid making these all optional?
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

class App extends Component<IAppProps> {

	public render() {
		if (this.props.globalError) {
			return (
					<ErrorPage error={this.props.globalError} fullPage={true}/>
			);
		}

		if (this.props.waitingFor.length > 0) {
			return (
					<FullPageSpinner/>
			);
		}

		if (!this.props.activeUser) {
			return (
					<Switch>
						<Route exact path="/auth/login" component={Login}/>
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
								<Route exact path="/" component={Dashboard}/>
								<Route path="/transactions" component={Transactions}/>

								<Route path="/reports/balance-growth" component={BalanceGrowth}/>
								<Route path="/reports/asset-growth" component={AssetGrowth}/>
								<Route path="/reports/budget-performance" component={BudgetPerformance}/>

								<Route path="/settings/accounts" component={Accounts}/>
								<Route path="/settings/budgets" component={Budgets}/>
								<Route path="/settings/categories" component={Categories}/>
								<Route path="/settings/profiles" component={Profiles}/>

								{/* Adding a new route? Keep it above this one! */}
								<Route render={() => {
									const error = new Http404Error(this.props.currentPath);
									return (
											<ErrorPage error={error}/>
									);
								}}/>
							</Switch>
						</AppContentWrapper>
					</AppRootWrapper>
				</div>
		);
	}
}

export default connect(mapStateToProps)(App);
