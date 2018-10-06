import * as Moment from "moment";
import * as React from "react";
import { ReactNode } from "react";
import { ThinAccount } from "../../server/model-thins/ThinAccount";
import { ThinBudget } from "../../server/model-thins/ThinBudget";
import { ThinCategory } from "../../server/model-thins/ThinCategory";
import * as bs from "../bootstrap-aliases";
import * as appStyles from "../components/App/App.scss";
import { combine } from "./style-helpers";

function generateBadge(content: string, badgeClass?: string): ReactNode {
	badgeClass = badgeClass || bs.badgeLight;
	return (<span className={combine(bs.badge, badgeClass)}>{content}</span>);
}

function formatCurrency(amount: number): string {
	return amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

function formatCurrencyStyled(amount: number): ReactNode {
	return (<span className={appStyles.currency}>{formatCurrency(amount)}</span>);
}

function formatDate(date: Date | Moment.Moment | string, format: "user" | "system" = "user"): string {
	if (format === "user") {
		return Moment(date).format("DD/MM/YYYY");
	} else if (format === "system") {
		return Moment(date).format("YYYY-MM-DD");
	}
}

// accounts

function generateAccountTypeBadge(account: ThinAccount): ReactNode {
	switch (account.type) {
		case "current":
			return generateBadge("Current Account", bs.badgeInfo);
		case "savings":
			return generateBadge("Savings Account", bs.badgeSuccess);
		case "asset":
			return generateBadge("Asset", bs.badgeWarning);
		default:
			return generateBadge("Other", bs.badgeDanger);
	}
}

// budgets

function generateBudgetTypeBadge(budget: ThinBudget): ReactNode {
	if (budget.type === "budget") {
		return generateBadge("Budget", bs.badgeInfo);
	} else {
		return generateBadge("Bill", bs.badgeWarning);
	}
}

function getBudgetPeriodType(start: Date | string, end: Date | string): string {
	if (typeof start === "string") {
		start = new Date(start);
	}

	if (typeof end === "string") {
		end = new Date(end);
	}

	return getBudgetPeriodTypeInternal(start as Date, end as Date);
}

function getBudgetPeriodTypeInternal(start: Date, end: Date): string {
	const oneDay = 24 * 60 * 60 * 1000;

	if (start.getDate() === 1
			&& start.getMonth() === end.getMonth()
			&& new Date(end.getTime() + oneDay).getMonth() !== end.getMonth()) {
		return "month";

	} else if (start.getDate() === 1
			&& start.getMonth() === 0
			&& end.getDate() === 31
			&& end.getMonth() === 11
			&& start.getFullYear() === end.getFullYear()) {
		return "calendar year";

	} else if (start.getDate() === 6
			&& start.getMonth() === 3
			&& end.getDate() === 5
			&& end.getMonth() === 3
			&& start.getFullYear() === end.getFullYear() - 1) {
		return "tax year";

	} else {
		return "other";
	}
}

function formatBudgetPeriod(start: Date | string, end: Date | string): string {
	const type = getBudgetPeriodType(start, end);

	if (type === "month") {
		return Moment(start).format("MMM, YYYY");
	} else if (type === "calendar year") {
		return Moment(start).format("YYYY");
	} else if (type === "tax year") {
		return `${Moment(start).format("YYYY")}/${Moment(end).format("YYYY")} tax year`;
	} else {
		return `${formatDate(start)} to ${formatDate(end)}`;
	}
}

// categories

function generateCategoryTypeBadge(category: ThinCategory): ReactNode {
	if (category.isAssetGrowthCategory) {
		return generateBadge("Asset", bs.badgeWarning);
	} else if (category.isExpenseCategory) {
		return generateBadge("Expense", bs.badgeDanger);
	} else if (category.isIncomeCategory) {
		return generateBadge("Income", bs.badgeSuccess);
	} else if (category.isMemoCategory) {
		return generateBadge("Memo", bs.badgeInfo);
	} else {
		return (<span className={bs.textMuted}>None</span>);
	}
}

export {
	formatCurrency,
	formatCurrencyStyled,
	generateBadge,

	generateAccountTypeBadge,

	formatBudgetPeriod,
	getBudgetPeriodType,
	generateBudgetTypeBadge,

	generateCategoryTypeBadge,
};
