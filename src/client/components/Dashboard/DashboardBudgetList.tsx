import * as React from "react";
import { ReactNode } from "react";
import ReactTooltip from "react-tooltip";
import { IBudgetBalance } from "../../../models/IBudgetBalance";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatBudgetPeriod, formatCurrency, getBudgetPeriodType } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { Card } from "../_ui/Card/Card";
import { MaterialIconName, MaterialIcon } from "../_ui/MaterialIcon/MaterialIcon";
import { BudgetApi } from "../../api/budgets";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import * as styles from "./DashboardBudgetList.scss";

function DashboardBudgetList(): React.ReactElement {
  const [budgetBalances, setBudgetBalances] = React.useState<IBudgetBalance[]>();
  React.useEffect(() => {
    BudgetApi.getBudgetBalances()
      .then(setBudgetBalances)
      .catch((err) => {
        globalErrorManager.emitNonFatalError("Failed to load budget balances", err);
        setBudgetBalances([]);
      });
  }, []);

  React.useEffect(() => {
    ReactTooltip.rebuild();
  });

  if (!budgetBalances) {
    return <LoadingSpinner centre={true} />;
  }

  function renderGroup(budgetBalances: IBudgetBalance[], title?: string): ReactNode {
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
      <Card title={displayTitle} icon={"pie_chart"}>
        {budgets.length > 0 && <div className={bs.row}>{budgets.map(renderSingleBudgetBalance)}</div>}
        {budgets.length > 0 && bills.length > 0 && <hr className={combine(bs.mt0, bs.mb3)} />}
        {bills.length > 0 && <div className={bs.row}>{bills.map(renderSingleBudgetBalance)}</div>}
      </Card>
    );
  }

  function renderSingleBudgetBalance(budgetBalance: IBudgetBalance): ReactNode {
    const budget = budgetBalance.budget;
    const spend = budgetBalance.balance * -1;
    const percentSpend = spend / budget.amount;

    let barClass = bs.bgInfo;
    let barIcon: MaterialIconName = "";
    let barMsg = "";
    const tooltip = `Spent ${formatCurrency(spend)} of ${formatCurrency(budget.amount)}`;

    if (budget.type === "budget") {
      if (percentSpend > 1.0) {
        barClass = bs.bgDanger;
        barIcon = "warning";
      } else if (percentSpend > 0.8) {
        barClass = bs.bgWarning;
        barIcon = "warning";
      }
    } else {
      if (percentSpend > 1.05) {
        barClass = bs.bgDanger;
        barIcon = "warning";
        barMsg = `Overpaid: ${formatCurrency(spend)}`;
      } else if (percentSpend > 1) {
        barClass = bs.bgWarning;
        barIcon = "warning";
        barMsg = `Overpaid: ${formatCurrency(spend)}`;
      } else if (percentSpend > 0.9) {
        barClass = bs.bgSuccess;
        barIcon = "check";
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
                {barIcon && <MaterialIcon icon={barIcon} className={bs.me2} />}
                {barMsg}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
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
      {renderGroup(groupedBudgets.month)}
      {renderGroup(groupedBudgets.calendarYear)}
      {renderGroup(groupedBudgets.taxYear)}
      {renderGroup(groupedBudgets.other, "Other")}
    </>
  );
}

export { DashboardBudgetList };
