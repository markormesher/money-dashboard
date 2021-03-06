import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faChartPie, faCheckCircle, faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import ReactTooltip from "react-tooltip";
import { IBudgetBalance } from "../../../commons/models/IBudgetBalance";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatBudgetPeriod, formatCurrency, getBudgetPeriodType } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { Card } from "../_ui/Card/Card";
import * as styles from "./DashboardBudgetList.scss";

interface IDashboardBudgetListProps {
  readonly budgetBalances?: IBudgetBalance[];
}

class DashboardBudgetList extends PureComponent<IDashboardBudgetListProps> {
  public componentDidMount(): void {
    ReactTooltip.rebuild();
  }

  public componentDidUpdate(): void {
    ReactTooltip.rebuild();
  }

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
      <Card title={displayTitle} icon={faChartPie}>
        {budgets.length > 0 && (
          <div className={bs.row}>{budgets.map(DashboardBudgetList.renderSingleBudgetBalance)}</div>
        )}
        {budgets.length > 0 && bills.length > 0 && <hr className={combine(bs.mt0, bs.mb3)} />}
        {bills.length > 0 && <div className={bs.row}>{bills.map(DashboardBudgetList.renderSingleBudgetBalance)}</div>}
      </Card>
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
        <p>
          <strong>{budget.category.name}</strong>
        </p>
        <div data-tip={tooltip}>
          <div className={bs.progress}>
            <div className={combine(bs.progressBar, barClass)} style={{ width: `${percentSpend * 100}%` }}>
              <span>
                {barIcon && <FontAwesomeIcon icon={barIcon} className={bs.mr2} />}
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
      return <LoadingSpinner centre={true} />;
    }

    const groupedBudgets = {
      month: budgetBalances.filter((b) => getBudgetPeriodType(b.budget.startDate, b.budget.endDate) === "month"),
      calendarYear: budgetBalances.filter(
        (b) => getBudgetPeriodType(b.budget.startDate, b.budget.endDate) === "calendar year",
      ),
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

export { DashboardBudgetList };
