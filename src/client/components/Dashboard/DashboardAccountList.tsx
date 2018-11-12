import { faPiggyBank } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component, ReactNode } from "react";
import { IAccountSummary } from "../../../server/model-thins/IAccountSummary";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrencyStyled } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import * as styles from "./DashboardAccountList.scss";

interface IDashboardAccountListProps {
	readonly accountSummaries: IAccountSummary[];
}

class DashboardAccountList extends Component<IDashboardAccountListProps> {

	private static sortByAbsoluteBalanceComparator(a: IAccountSummary, b: IAccountSummary): number {
		return Math.abs(b.balance) - Math.abs(a.balance);
	}

	public render(): ReactNode {
		const { accountSummaries } = this.props;
		return (
				<div className={bs.card}>
					<h5 className={combine(bs.cardHeader, bs.h5)}>
						<FontAwesomeIcon icon={faPiggyBank} className={bs.mr3}/>
						Account Balances
					</h5>
					<div className={combine(bs.cardBody, gs.cardBody)}>
						{
							!accountSummaries
							&& <LoadingSpinner centre={true}/>
							|| this.renderInner()
						}
					</div>
				</div>
		);
	}

	private renderInner(): ReactNode {
		const total = this.props.accountSummaries.map((a) => a.balance).reduce((a, b) => a + b);
		return (
				<div className={styles.accountList}>
					{this.renderAccountSummaryList("current", "Current Accounts")}
					{this.renderAccountSummaryList("savings", "Savings Accounts")}
					{this.renderAccountSummaryList("asset", "Assets")}
					{this.renderAccountSummaryList("other", "Other")}
					<hr/>
					<p>
						Total
						<span className={bs.floatRight}>
							{formatCurrencyStyled(total)}
						</span>
					</p>
				</div>
		);
	}

	private renderAccountSummaryList(type: string, title: string): ReactNode {
		const summaries = this.props.accountSummaries
				.filter((a) => a.account.type === type)
				.filter((a) => a.balance !== 0);

		if (summaries.length === 0) {
			return null;
		}

		return (
				<>
					<h6>{title}</h6>
					{
						summaries
								.sort(DashboardAccountList.sortByAbsoluteBalanceComparator)
								.map(this.renderSingleAccountSummary)
					}
				</>
		);
	}

	private renderSingleAccountSummary(summary: IAccountSummary): ReactNode {
		return (
				<p key={summary.account.id}>
					{summary.account.name}
					<span className={bs.floatRight}>
						{formatCurrencyStyled(summary.balance)}
					</span>
				</p>
		);
	}
}

export {
	DashboardAccountList,
};
