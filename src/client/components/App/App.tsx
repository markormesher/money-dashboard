import "bootstrap/dist/css/bootstrap.css";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import * as bs from "../../bootstrap-aliases";
import Http404Error from "../../helpers/errors/Http404Error";
import { combine } from "../../helpers/style-helpers";
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
import Login from "../Login/Login";
import ProfileSettings from "../ProfileSettings/ProfileSettings";
import Transactions from "../Transactions/Transactions";
import "./App.scss";

interface IAppProps {
	waitingFor?: string[];
	globalError?: Error;
	modalOpen?: boolean;
	activeUser?: ThinUser;
	currentPath?: string;
}

function mapStateToProps(state: IRootState, props: IAppProps): IAppProps {
	return {
		...props,
		waitingFor: state.global.waitingFor,
		globalError: state.global.error,
		modalOpen: state.global.modalOpen,
		activeUser: state.auth.activeUser,
		currentPath: state.router.location.pathname,
	};
}

class App extends Component<IAppProps> {

	public render() {
		const { waitingFor, globalError, modalOpen, activeUser, currentPath } = this.props;

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

								<Route path="/reports/balance-growth" component={BalanceGrowthReport}/>
								<Route path="/reports/asset-growth" component={AssetGrowthReport}/>

								<Route path="/settings/accounts" component={AccountSettings}/>
								<Route path="/settings/budgets" component={BudgetSettings}/>
								<Route path="/settings/categories" component={CategorySettings}/>
								<Route path="/settings/profiles" component={ProfileSettings}/>

								{/* Adding a new route? Keep it above this one! */}
								<Route render={() => {
									const error = new Http404Error(currentPath);
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
