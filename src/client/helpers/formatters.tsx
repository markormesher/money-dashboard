import * as Moment from "moment";
import * as React from "react";
import { ReactElement } from "react";
import { IAccount } from "../../server/models/IAccount";
import { IBudget } from "../../server/models/IBudget";
import { ICategory } from "../../server/models/ICategory";
import { Badge } from "../components/_ui/Badge/Badge";
import * as bs from "../global-styles/Bootstrap.scss";
import * as gs from "../global-styles/Global.scss";

type BudgetPeriod = "month" | "calendar year" | "tax year" | "other";

function formatCurrency(amount: number): string {
	return amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

function formatCurrencyStyled(amount: number): ReactElement<void> {
	return (<span className={gs.currency}>{formatCurrency(amount)}</span>);
}

function formatDate(date: Date | Moment.Moment | string, format: "user" | "system" = "user"): string {
	if (!date) {
		return undefined;
	}

	/* istanbul ignore else: protected by type system */
	if (format === "user") {
		return Moment(date).format("DD MMM YYYY");
	} else if (format === "system") {
		return Moment(date).format("YYYY-MM-DD");
	}
}

function capitaliseFirstLetter(str?: string): string {
	if (!str) {
		return str;
	}
	return str.slice(0, 1).toUpperCase() + str.slice(1);
}

// accounts

function generateAccountTypeBadge(account: IAccount): ReactElement<void> {
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

function generateBudgetTypeBadge(budget: IBudget): ReactElement<void> {
	if (budget.type === "budget") {
		return (<Badge className={bs.badgeInfo}>Budget</Badge>);
	} else {
		return (<Badge className={bs.badgeWarning}>Bill</Badge>);
	}
}

function getBudgetPeriodType(start: Moment.Moment, end: Moment.Moment): BudgetPeriod {
	if (start.get("date") === 1
			&& start.get("month") === end.get("month")
			&& end.clone().add(1, "day").get("month") !== end.get("month")) {
		return "month";

	} else if (start.get("date") === 1
			&& start.get("month") === 0
			&& end.get("date") === 31
			&& end.get("month") === 11
			&& start.get("year") === end.get("year")) {
		return "calendar year";

	} else if (start.get("date") === 6
			&& start.get("month") === 3
			&& end.get("date") === 5
			&& end.get("month") === 3
			&& start.get("year") === end.get("year") - 1) {
		return "tax year";

	} else {
		return "other";
	}
}

function formatBudgetPeriod(start: Moment.Moment, end: Moment.Moment): string {
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

function generateCategoryTypeBadge(category: ICategory): Array<ReactElement<void>> {
	const output = [] as Array<ReactElement<void>>;
	if (category.isAssetGrowthCategory) {
		output.push((<Badge key={"category-asset"} className={bs.badgeWarning} marginRight={true}>Asset</Badge>));
	}
	if (category.isExpenseCategory) {
		output.push((<Badge key={"category-expense"} className={bs.badgeDanger} marginRight={true}>Expense</Badge>));
	}
	if (category.isIncomeCategory) {
		output.push((<Badge key={"category-income"} className={bs.badgeSuccess} marginRight={true}>Income</Badge>));
	}
	if (category.isMemoCategory) {
		output.push((<Badge key={"category-memo"} className={bs.badgeInfo} marginRight={true}>Memo</Badge>));
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
