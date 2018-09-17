import cn = require("classnames");
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

import * as bs from "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "jquery/dist/jquery";
import * as style from "./App.scss";

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
						<nav className={cn(bs.navbar, bs.navbarDark, bs.stickyTop, bs.bgDark, bs.flexMdNowrap, bs.p0)}>
							<Link to="/"
								  className={cn(bs.navbarBrand, style.navbarBrand, bs.colSm3, bs.colMd2, bs.mr0)}>
								Money Dashboard
							</Link>
							<ul className={cn(bs.navbarNav, bs.px3)}>
								<li className={cn(bs.navItem, bs.textNowrap)}>
									<Link to="#" className={bs.navLink} onClick={this.props.actions.logout}>
										Logout
									</Link>
								</li>
							</ul>
						</nav>

						<div className={bs.containerFluid}>
							<div className={bs.row}>
								<nav className={cn(bs.colMd2, bs.dNone, bs.dMdBlock, bs.bgLight, style.sidebar)}>
									<div className={style.sidebarSticky}>
										<ul className={cn(bs.nav, bs.flexColumn)}>
											<li className={bs.navItem}>
												<Link to="/" className={cn(bs.navLink, style.navLink, style.active)}>
													{/* ICON */}
													Dashboard
												</Link>
											</li>
										</ul>

										<h6 className={cn(style.sidebarHeading, bs.dFlex, bs.justifyContentBetween, bs.alignItemsCenter, bs.px3, bs.mt4, bs.mb1, bs.textMuted)}>
											<span>Reports</span>
										</h6>
										<ul className={cn(bs.nav, bs.flexColumn)}>
											<li className={bs.navItem}>
												<Link to="/transactions" className={cn(bs.navLink, style.navLink)}>
													{/* ICON */}
													Transactions
												</Link>
											</li>
										</ul>
									</div>
								</nav>

								<main role="main" className={cn(bs.colMd9, bs.colLg10, bs.mlSmAuto, bs.pt3, bs.px4)}>
									<div className={cn(bs.dFlex, bs.justifyContentBetween, bs.flexWrap, bs.flexMdNowrap, bs.alignItemsCenter, bs.pb2, bs.mb3)}>
										<Switch>
											<Route exact path="/" component={Dashboard}/>
											<Route path="/transactions" component={Transactions}/>

											{/* TODO: when rendering the 404, disable all the other UI elements */}
											<Route render={() => (<FullPageError error={new Http404Error()}/>)}/>
										</Switch>
										{/*
										This will be useful somewhere
										<div className="btn-toolbar mb-2 mb-md-0">
											<div className="btn-group mr-2">
												<button className="btn btn-sm btn-outline-secondary">Share</button>
												<button className="btn btn-sm btn-outline-secondary">Export</button>
											</div>
										</div>
										*/}
									</div>
								</main>
							</div>
						</div>
					</div>
				</BrowserRouter>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
