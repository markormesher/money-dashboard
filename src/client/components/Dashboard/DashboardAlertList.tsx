import * as React from "react";
import { ICategoryBalance } from "../../../models/ICategoryBalance";
import { CategoryApi } from "../../api/categories";
import bs from "../../global-styles/Bootstrap.scss";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { formatCurrencyStyled } from "../../helpers/formatters";
import { Card } from "../_ui/Card/Card";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";

function DashboardAlertList(): React.ReactElement | null {
  const [memoBalances, setMemoBalances] = React.useState<ICategoryBalance[]>();
  React.useEffect(() => {
    CategoryApi.getMemoCategoryBalances()
      .then(setMemoBalances)
      .catch((err) => {
        globalErrorManager.emitNonFatalError("Failed to load memo category balances", err);
        setMemoBalances([]);
      });
  }, []);

  if (!memoBalances) {
    return <LoadingSpinner centre={true} />;
  }

  const allAlerts: React.ReactElement[] = [];

  memoBalances?.forEach((mb) => {
    if (mb.balance != 0) {
      allAlerts.push(
        <p key={`memo-balance-${mb.category.id}`}>
          {mb.category.name} balance is {formatCurrencyStyled(mb.balance)}
        </p>,
      );
    }
  });

  if (allAlerts.length === 0) {
    return null;
  }

  const title = `${allAlerts.length} Alert${allAlerts.length === 1 ? "" : "s"}`;
  return (
    <Card title={title} icon={"warning"} iconClasses={bs.textDanger}>
      {...allAlerts}
    </Card>
  );
}

export { DashboardAlertList };
