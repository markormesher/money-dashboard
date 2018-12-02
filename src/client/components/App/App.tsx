import * as React from "react";
import { ErrorInfo, PureComponent, ReactElement, ReactNode } from "react";
import * as Loadable from "react-loadable";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { ThinUser } from "../../../server/model-thins/ThinUser";
import { DetailedError } from "../../helpers/errors/DetailedError";
import { Http404Error } from "../../helpers/errors/Http404Error";
import { IRootState } from "../../redux/root";
import { FullPageSpinner } from "../_ui/FullPageSpinner/FullPageSpinner";
import { AccountsPage } from "../AccountsPage/AccountsPage";
import { AssetPerformanceReport } from "../AssetPerformanceReport/AssetPerformanceReport";
import { BalanceHistoryReport } from "../BalanceHistoryReport/BalanceHistoryReport";
import { BudgetsPage } from "../BudgetsPage/BudgetsPage";
import { CategoriesPage } from "../CategoriesPage/CategoriesPage";
import { Dashboard } from "../Dashboard/Dashboard";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import { Header } from "../Header/Header";
import { KeyShortcutModal } from "../KeyShortcutModal/KeyShortcutModal";
import { Nav } from "../Nav/Nav";
import { ProfilesPage } from "../ProfilesPage/ProfilesPage";
import { TransactionsPage } from "../TransactionsPage/TransactionsPage";
import { AppContentWrapper } from "./AppContentWrapper";
import { AppRootWrapper } from "./AppRootWrapper";

interface IAppProps {
	readonly waitingFor?: string[];
	readonly globalError?: Error;
	readonly activeUser?: ThinUser;
	readonly currentPath?: string;
}

interface IAppState {
	readonly caughtError?: Error;
	readonly caughtErrorInfo?: ErrorInfo;
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
	loader: () => import(/* webpackChunkName: "login" */ "../LoginPage/LoginPage").then((result) => result.LoginPage),
	loading: () => (<FullPageSpinner/>),
});

class UCApp extends PureComponent<IAppProps, IAppState> {

	constructor(props: IAppProps) {
		super(props);
		this.state = {};
		this.render404Error = this.render404Error.bind(this);
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		this.setState({
			caughtError: error,
			caughtErrorInfo: errorInfo,
		});
	}

	public render(): ReactNode {
		const { waitingFor, globalError, activeUser } = this.props;
		const { caughtError, caughtErrorInfo } = this.state;

		if (globalError) {
			return (
					<ErrorPage error={globalError} fullPage={true}/>
			);
		}

		if (caughtError) {
			return (
					<ErrorPage
							error={new DetailedError(caughtError.name, caughtError.message)}
							fullPage={true}
							stacks={[
									caughtError.stack,
									`Component stack:${caughtErrorInfo.componentStack}`,
							]}
					/>
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
						<KeyShortcutModal/>
						<Nav/>
						<AppContentWrapper>
							<Switch>
								<Route exact={true} path="/" component={Dashboard}/>
								<Route path="/accounts" component={AccountsPage}/>
								<Route path="/budgets" component={BudgetsPage}/>
								<Route path="/categories" component={CategoriesPage}/>
								<Route path="/profiles" component={ProfilesPage}/>
								<Route path="/transactions" component={TransactionsPage}/>

								<Route path="/reports/balance-history" component={BalanceHistoryReport}/>
								<Route path="/reports/asset-performance" component={AssetPerformanceReport}/>

								{/* Adding a new route? Keep it above this one! */}
								<Route render={this.render404Error}/>
							</Switch>
						</AppContentWrapper>
					</AppRootWrapper>
				</div>
		);
	}

	private render404Error(): ReactElement<void> {
		const { currentPath } = this.props;
		const error = new Http404Error(currentPath);
		return (
				<ErrorPage error={error}/>
		);
	}
}

export const App = connect(mapStateToProps)(UCApp);
