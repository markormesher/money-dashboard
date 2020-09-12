import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactNode, ReactElement } from "react";
import { ICategoryBalance } from "../../../commons/models/ICategoryBalance";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatCurrencyStyled } from "../../helpers/formatters";
import { Card } from "../_ui/Card/Card";

interface IDashboardAlertListProps {
  readonly memoCategoryBalances?: ICategoryBalance[];
}

class DashboardAlertList extends PureComponent<IDashboardAlertListProps> {
  private getNonZeroMemos(): ReactElement[] {
    return (this.props.memoCategoryBalances || [])
      .filter((mcb) => mcb.balance !== 0)
      .map((m) => (
        <>
          {m.category.name} balance is {formatCurrencyStyled(m.balance)}
        </>
      ));
  }

  public render(): ReactNode {
    const allAlerts = [...this.getNonZeroMemos()];

    if (allAlerts.length === 0) {
      return null;
    }

    const title = `${allAlerts.length} Alert${allAlerts.length === 1 ? "" : "s"}`;

    return (
      <Card title={title} icon={faExclamationTriangle} iconClasses={bs.textDanger}>
        {allAlerts.map((w, i) => (
          <p key={i}>{w}</p>
        ))}
      </Card>
    );
  }
}

export { DashboardAlertList };
