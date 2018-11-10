import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChartPie, faCheckCircle, faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { IBudgetBalance } from "../../../server/statistics/budget-statistics";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatBudgetPeriod, formatCurrency, getBudgetPeriodType } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import * as styles from "./DashboardBudgetList.scss";

interface IDashboardBudgetListProps {
	readonly budgetBalances?: IBudgetBalance[];
}

class DashboardBudgetList extends PureComponent<IDashboardBudgetListProps> {

	private static renderGroup(budgetBalances: IBudgetBalance[], title?: string): ReactNode {
		if (budgetBalances.length === 0) {
			return null;
		}

		const firstBudget = budgetBalances[0].budget;
		const displayTitle = title ? title : formatBudgetPeriod(firstBudget.startDate, firstBudget.endDate);

		const budgets = budgetBalances
				.filter((b) => b.budget.type === "budget")
				.sort((a, b) => a.budget.category.name.localeCompare(b.budget.category.name));
		const bills = budgetBalances
				.filter((b) => b.budget.type === "bill")
				.sort((a, b) => a.budget.category.name.localeCompare(b.budget.category.name));

		return (
				<div className={combine(bs.card, bs.mb3)}>
					<h5 className={combine(bs.cardHeader, bs.h5)}>
						<FontAwesomeIcon icon={faChartPie} className={bs.mr3}/>
						{displayTitle}
					</h5>
					<div className={bs.cardBody}>
						{
							budgets.length > 0
							&& <div className={combine(bs.row, styles.budgetBalanceGroup)}>
								{budgets.map(DashboardBudgetList.renderSingleBudgetBalance)}
							</div>
						}
						{budgets.length > 0 && bills.length > 0 && <hr/>}
						{
							bills.length > 0
							&& <div className={combine(bs.row, styles.budgetBalanceGroup)}>
								{bills.map(DashboardBudgetList.renderSingleBudgetBalance)}
							</div>
						}
					</div>
				</div>
		);
	}

	private static renderSingleBudgetBalance(budgetBalance: IBudgetBalance): ReactNode {
		const budget = budgetBalance.budget;
		const spend = budgetBalance.balance * -1;
		const percentSpend = spend / budget.amount;

		let barClass = bs.bgInfo;
		let barIcon: IconProp;
		let barMsg: string;
		const tooltip = `Spent ${formatCurrency(spend)} of ${formatCurrency(budget.amount)}`;

		if (budget.type === "budget") {
			if (percentSpend > 1.0) {
				barClass = bs.bgDanger;
				barIcon = faExclamationTriangle;
			} else if (percentSpend > 0.8) {
				barClass = bs.bgWarning;
				barIcon = faExclamationTriangle;
			}
		} else {
			if (percentSpend > 1.05) {
				barClass = bs.bgDanger;
				barIcon = faExclamationTriangle;
				barMsg = `Overpaid: ${formatCurrency(spend)}`;
			} else if (percentSpend > 1) {
				barClass = bs.bgWarning;
				barIcon = faExclamationTriangle;
				barMsg = `Overpaid: ${formatCurrency(spend)}`;
			} else if (percentSpend > 0.9) {
				barClass = bs.bgSuccess;
				barIcon = faCheckCircle;
				barMsg = `Paid ${formatCurrency(spend)}`;
			}
		}

		return (
				<div key={budget.id} className={combine(bs.col12, bs.colSm6, bs.colMd4, styles.budgetBalance)}>
					<p><strong>{budget.category.name}</strong></p>
					<div data-tooltip={tooltip}>
						<div className={bs.progress}>
							<div
									className={combine(bs.progressBar, barClass)}
									style={{ width: `${percentSpend * 100}%` }}
							>
								<span>
									{barIcon && <FontAwesomeIcon icon={barIcon} className={bs.mr2}/>}
									{barMsg}
								</span>
							</div>
						</div>
					</div>
				</div>
		);
	}

	public render(): ReactNode {
		const { budgetBalances } = this.props;
		if (!budgetBalances) {
			return (<LoadingSpinner centre={true}/>);
		}

		const groupedBudgets = {
			month: budgetBalances.filter((b) => getBudgetPeriodType(b.budget.startDate, b.budget.endDate) === "month"),
			calendarYear: budgetBalances
					.filter((b) => getBudgetPeriodType(b.budget.startDate, b.budget.endDate) === "calendar year"),
			taxYear: budgetBalances.filter((b) => getBudgetPeriodType(b.budget.startDate, b.budget.endDate) === "tax year"),
			other: budgetBalances.filter((b) => getBudgetPeriodType(b.budget.startDate, b.budget.endDate) === "other"),
		};

		return (
				<>
					{DashboardBudgetList.renderGroup(groupedBudgets.month)}
					{DashboardBudgetList.renderGroup(groupedBudgets.calendarYear)}
					{DashboardBudgetList.renderGroup(groupedBudgets.taxYear)}
					{DashboardBudgetList.renderGroup(groupedBudgets.other, "Other")}
				</>
		);
	}
}

export {
	DashboardBudgetList,
};
