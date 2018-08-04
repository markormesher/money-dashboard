import React, { Component } from "react";
import { Switch, Route, Link } from "react-router-dom";

import Dashboard from "../Dashboard/Dashboard";
import Transactions from "../Transactions/Transactions";

import bs from "bootstrap/dist/css/bootstrap.min.css";
import gent from "gentelella/build/css/custom.min.css";

class App extends Component {

	render = () => (
			<div className={[gent.container, gent.body]}>
				<div className={[bs["col-md-3"], gent.left_col]}>
					<div className={[gent.navbar, gent.nav_title]}>
						<Route exact path="/" className={gent.site_title}>
							Money Dashboard
						</Route>
					</div>
					<div className={bs.clearfix}/>
					<div className={[gent.main_menu_side, gent.main_menu]}>
						<div className={gent.menu_section}>
							<h3>General</h3>
							<ul className={[gent["side-menu"], gent.nav]}>
								<li><Link to="/">Dashboard</Link></li>
								<li><Link to="/transactions">Transactions</Link></li>
							</ul>
						</div>
					</div>
				</div>
				<div className={gent.top_nav}>
					<div className={gent.nav_menu}>
						<nav>
							<div className={[gent.nav, gent.toggle]}>
								<a id="menu_toggle">
									<!-- <i class="far fa-bars"></i> -->
								</a>
							</div>
							<ul className={[gent.nav, gent["navbar-nav"], gent["navbar-right"]]}>
								<li className={gent.dropdown}>
									<a className={gent["dropdown-toggle"]} data-toggle="dropdown" href="javascript:">
										<span className={bs["hidden-xs"]}>Personal Profile</span>
										<!-- <i class="far fa-caret-down text-muted"></i> -->
									</a>
									<ul className={[gent["dropdown-menu"], bs["pull-right"]]}>
										<li>
											<a href="/">
												<!-- <i class="far fa-fw fa-check-square"></i> -->Personal Profile
											</a>
										</li>
										<li>
											<a href="/">
												<!-- <i class="far fa-fw fa-square"></i> -->Shared Profile
											</a>
										</li>
										<li className={gent.divider}/>
										<li>
											<a href="/">
												<!-- <i class="far fa-fw fa-pencil"></i> -->Edit Profiles
											</a>
										</li>
										<li>
											<a href="/">
												<!-- <i class="far fa-fw fa-plus"></i> -->New Profile
											</a>
										</li>
									</ul>
								</li>
								<li className={gent.dropdown}>
									<a className={[gent["user-profile"], gent["dropdown-toggle"]]} data-toggle="dropdown" href="javascript:">
										<img src="https://lh3.googleusercontent.com/-2iOijKSH_C8/AAAAAAAAAAI/AAAAAAAAT3s/I2nCKstLGyI/photo.jpg?sz=50"/>
										<span className={bs["hidden-xs"]}>Mark Ormesher</span>
										<!-- <i class="far fa-caret-down text-muted"></i> -->
									</a>
									<ul className={[gent["dropdown-menu"], bs["pull-right"]]}>
										<li>
											<a href="/">
												<!-- <i class="far fa-fw fa-sign-out title-icon"></i> -->Logout
											</a>
										</li>
									</ul>
								</li>
							</ul>
						</nav>
					</div>
				</div>
				<div className={gent.right_col}>
					<main>
						<Switch>
							<Route exact path="/" component={Dashboard}/>
							<Route path="/transactions" component={Transactions}/>
						</Switch>
					</main>

				</div>
			</div>

	)
}

export default App;
