import * as React from "react";
import { ReactElement } from "react";
import { format, getDate, getMonth, getYear, endOfMonth } from "date-fns";
import { IAccount } from "../../models/IAccount";
import { IBudget } from "../../models/IBudget";
import { ICategory } from "../../models/ICategory";
import { Badge } from "../components/_ui/Badge/Badge";
import * as bs from "../global-styles/Bootstrap.scss";
import * as gs from "../global-styles/Global.scss";

type BudgetPeriod = "month" | "calendar year" | "tax year" | "other";

function formatCurrency(amount: number, places = 2): string {
  return amount.toFixed(places).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
}

function formatCurrencyStyled(amount: number, places = 2): ReactElement {
  const formatted = formatCurrency(amount, places);
  return <span className={gs.currency}>{formatted}</span>;
}

function formatCurrencyForStat(amount: number, places = 2): ReactElement {
  const negative = amount < 0;
  const formatted = formatCurrency(Math.abs(amount), places);
  const chunks = formatted.split(".");
  return (
    <span>
      {negative && "-"}&pound;{chunks[0]}.<span className={gs.currencyPence}>{chunks[1]}</span>
    </span>
  );
}

function formatPercent(amount: number): string {
  return amount.toFixed(2) + "%";
}

function formatDate(date: number, toFormat: "user" | "system" = "user"): string {
  if (!date && date !== 0) {
    return undefined;
  }

  /* istanbul ignore else: protected by type system */
  if (toFormat === "user") {
    return format(date, "dd MMM yyyy");
  } else if (toFormat === "system") {
    return format(date, "yyyy-MM-dd");
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
      return <Badge className={bs.bgInfo}>Current Account</Badge>;
    case "savings":
      return <Badge className={bs.bgSuccess}>Savings Account</Badge>;
    case "asset":
      return <Badge className={bs.bgWarning}>Asset</Badge>;
    case "other":
      return <Badge className={bs.bgDanger}>Other</Badge>;
    default:
      throw new Error(`Invalid account type: ${account.type}`);
  }
}

// budgets

function generateBudgetTypeBadge(budget: IBudget): ReactElement<void> {
  if (budget.type === "budget") {
    return <Badge className={bs.bgInfo}>Budget</Badge>;
  } else {
    return <Badge className={bs.bgWarning}>Bill</Badge>;
  }
}

function getBudgetPeriodType(start: number, end: number): BudgetPeriod {
  if (
    getDate(start) === 1 &&
    getMonth(start) === getMonth(end) &&
    getDate(end) === getDate(endOfMonth(end)) &&
    getYear(start) === getYear(end)
  ) {
    return "month";
  } else if (
    getDate(start) === 1 &&
    getMonth(start) === 0 &&
    getDate(end) === 31 &&
    getMonth(end) === 11 &&
    getYear(start) === getYear(end)
  ) {
    return "calendar year";
  } else if (
    getDate(start) === 6 &&
    getMonth(start) === 3 &&
    getDate(end) === 5 &&
    getMonth(end) === 3 &&
    getYear(start) === getYear(end) - 1
  ) {
    return "tax year";
  } else {
    return "other";
  }
}

function formatBudgetPeriod(start: number, end: number): string {
  const type = getBudgetPeriodType(start, end);

  if (type === "month") {
    return format(start, "MMM, yyyy");
  } else if (type === "calendar year") {
    return format(start, "yyyy");
  } else if (type === "tax year") {
    return `${format(start, "yyyy")}/${format(end, "yyyy")} tax year`;
  } else {
    return `${formatDate(start)} to ${formatDate(end)}`;
  }
}

// categories

function generateCategoryTypeBadge(category: ICategory): Array<ReactElement<void>> {
  const output = [] as Array<ReactElement<void>>;
  if (category.isAssetGrowthCategory) {
    output.push(
      <Badge key={"category-asset"} className={bs.bgWarning} marginRight={true}>
        Asset Growth
      </Badge>,
    );
  }
  if (category.isExpenseCategory) {
    output.push(
      <Badge key={"category-expense"} className={bs.bgDanger} marginRight={true}>
        Expense
      </Badge>,
    );
  }
  if (category.isIncomeCategory) {
    output.push(
      <Badge key={"category-income"} className={bs.bgSuccess} marginRight={true}>
        Income
      </Badge>,
    );
  }
  if (category.isMemoCategory) {
    output.push(
      <Badge key={"category-memo"} className={bs.bgInfo} marginRight={true}>
        Memo
      </Badge>,
    );
  }

  if (output.length > 0) {
    return output;
  } else {
    return [
      <span key={"category-badge-none"} className={bs.textMuted}>
        None
      </span>,
    ];
  }
}

export {
  formatCurrency,
  formatCurrencyStyled,
  formatCurrencyForStat,
  formatPercent,
  formatDate,
  capitaliseFirstLetter,
  generateAccountTypeBadge,
  formatBudgetPeriod,
  getBudgetPeriodType,
  generateBudgetTypeBadge,
  generateCategoryTypeBadge,
};
