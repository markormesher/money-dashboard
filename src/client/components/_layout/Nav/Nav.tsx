import {
	faAnalytics,
	faChartLine,
	faHome,
	faPiggyBank,
	faSignOut,
	faSlidersH,
	faTable,
	faTags,
	faUsers,
} from "@fortawesome/pro-light-svg-icons";
import { push } from "connected-react-router";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";
import { startLogOutCurrentUser } from "../../../redux/auth/actions";
import { IRootState } from "../../../redux/root";
import { KeyShortcut } from "../../_ui/KeyShortcut/KeyShortcut";
import { NavLink } from "../NavLink/NavLink";
import { NavSection } from "../NavSection/NavSection";
import * as style from "./Nav.scss";

interface INavProps {
	readonly isOpen?: boolean;

	readonly actions?: {
		readonly logout: () => AnyAction,
		readonly pushPath: (path: string) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: INavProps): INavProps {
	return {
		...props,
		isOpen: state.nav.isOpen,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: INavProps): INavProps {
	return {
		...props,
		actions: {
			logout: () => dispatch(startLogOutCurrentUser()),
			pushPath: (path: string) => dispatch(push(path)),
		},
	};
}

class UCNav extends PureComponent<INavProps> {

	constructor(props: INavProps, context: any) {
		super(props, context);

		this.handleGoToDashboard = this.handleGoToDashboard.bind(this);
		this.handleGoToTransactions = this.handleGoToTransactions.bind(this);
		this.handleGoToBalanceHistory = this.handleGoToBalanceHistory.bind(this);
		this.handleGoToAssetPerformance = this.handleGoToAssetPerformance.bind(this);
	}

	public render(): ReactNode {
		const isOpen = this.props.isOpen;
		const wrapperClasses = combine(
				(isOpen || bs.dNone), bs.dLgBlock,
				bs.col12, bs.colLg2,
				bs.p0, bs.bgLight, style.sidebar,
		);

		return (
				<>
					<KeyShortcut targetStr={"gd"} onTrigger={this.handleGoToDashboard}/>
					<KeyShortcut targetStr={"gt"} onTrigger={this.handleGoToTransactions}/>
					<KeyShortcut targetStr={"rb"} onTrigger={this.handleGoToBalanceHistory}/>
					<KeyShortcut targetStr={"ra"} onTrigger={this.handleGoToAssetPerformance}/>

					<nav className={wrapperClasses}>
						<div className={style.sidebarSticky}>
							<NavSection>
								<NavLink to="/" text="Dashboard" icon={faHome}/>
								<NavLink to="/transactions" text="Transactions" icon={faTable}/>
							</NavSection>

							<NavSection title="Reports">
								<NavLink to="/reports/balance-history" text="Balance History" icon={faChartLine}/>
								<NavLink to="/reports/asset-performance" text="Asset Performance" icon={faAnalytics}/>
							</NavSection>

							<NavSection title="Settings">
								<NavLink to="/settings/accounts" text="Accounts" icon={faPiggyBank}/>
								<NavLink to="/settings/budgets" text="Budgets" icon={faSlidersH}/>
								<NavLink to="/settings/categories" text="Categories" icon={faTags}/>
								<NavLink to="/settings/profiles" text="Profiles" icon={faUsers}/>
							</NavSection>

							<NavSection title="Account">
								<NavLink to="#" text="Logout" icon={faSignOut} onClick={this.props.actions.logout}/>
							</NavSection>
						</div>
					</nav>
				</>
		);
	}

	private handleGoToDashboard(): void {
		this.props.actions.pushPath("/");
	}

	private handleGoToTransactions(): void {
		this.props.actions.pushPath("/transactions");
	}

	private handleGoToBalanceHistory(): void {
		this.props.actions.pushPath("/reports/balance-history");
	}

	private handleGoToAssetPerformance(): void {
		this.props.actions.pushPath("/reports/asset-performance");
	}
}

export const Nav = connect(mapStateToProps, mapDispatchToProps)(UCNav);
