import * as React from "react";
import { CategoryApi } from "../../api/categories";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatCurrencyStyled } from "../../helpers/formatters";
import { Card } from "../_ui/Card/Card";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";

function DashboardAlertList(): React.ReactElement | null {
  const [memoBalances, refreshMemoBalances] = CategoryApi.useMemoCategoryBalances();
  React.useEffect(() => {
    refreshMemoBalances();
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
