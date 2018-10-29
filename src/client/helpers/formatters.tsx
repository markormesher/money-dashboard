import * as Moment from "moment";
import * as React from "react";
import { ReactElement } from "react";
import { ThinAccount } from "../../server/model-thins/ThinAccount";
import { ThinBudget } from "../../server/model-thins/ThinBudget";
import { ThinCategory } from "../../server/model-thins/ThinCategory";
import * as bs from "../bootstrap-aliases";
import { Badge } from "../components/_ui/Badge/Badge";
import * as appStyles from "../components/App/App.scss";

function formatCurrency(amount: number): string {
	return amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

function formatCurrencyStyled(amount: number): ReactElement<void> {
	return (<span className={appStyles.currency}>{formatCurrency(amount)}</span>);
}

function formatDate(date: Date | Moment.Moment | string, format: "user" | "system" = "user"): string {
	if (!date) {
		return undefined;
	}

	if (format === "user") {
		return Moment(date).format("DD/MM/YYYY");
	} else if (format === "system") {
		return Moment(date).format("YYYY-MM-DD");
	}
}

function capitaliseFirstLetter(str: string): string {
	return str.slice(0, 1).toUpperCase() + str.slice(1);
}

// accounts

function generateAccountTypeBadge(account: ThinAccount): ReactElement<void> {
	switch (account.type) {
		case "current":
			return (<Badge className={bs.badgeInfo}>Current Account</Badge>);
		case "savings":
			return (<Badge className={bs.badgeSuccess}>Savings Account</Badge>);
		case "asset":
			return (<Badge className={bs.badgeWarning}>Asset</Badge>);
		default:
			return (<Badge className={bs.badgeDanger}>Other</Badge>);
	}
}

// budgets

function generateBudgetTypeBadge(budget: ThinBudget): ReactElement<void> {
	if (budget.type === "budget") {
		return (<Badge className={bs.badgeInfo}>Budget</Badge>);
	} else {
		return (<Badge className={bs.badgeWarning}>Bill</Badge>);
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

function generateCategoryTypeBadge(category: ThinCategory): Array<ReactElement<void>> {
	const output = [] as Array<ReactElement<void>>;
	if (category.isAssetGrowthCategory) {
		output.push((<Badge className={bs.badgeWarning} marginRight={true}>Asset</Badge>));
	}
	if (category.isExpenseCategory) {
		output.push((<Badge className={bs.badgeDanger} marginRight={true}>Expense</Badge>));
	}
	if (category.isIncomeCategory) {
		output.push((<Badge className={bs.badgeSuccess} marginRight={true}>Income</Badge>));
	}
	if (category.isMemoCategory) {
		output.push((<Badge className={bs.badgeInfo} marginRight={true}>Memo</Badge>));
	}

	if (output.length > 0) {
		return output;
	} else {
		return [(<span key={"category-badge-none"} className={bs.textMuted}>None</span>)];
	}
}

export {
	formatCurrency,
	formatCurrencyStyled,
	formatDate,
	capitaliseFirstLetter,
	generateAccountTypeBadge,
	formatBudgetPeriod,
	getBudgetPeriodType,
	generateBudgetTypeBadge,
	generateCategoryTypeBadge,
};
