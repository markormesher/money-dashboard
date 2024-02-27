import * as React from "react";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { DashboardAccountList } from "./DashboardAccountList";
import { DashboardAlertList } from "./DashboardAlertList";
import { DashboardBudgetList } from "./DashboardBudgetList";
import { DashboardRateHistories } from "./DashboardRateHistories";
import { DashboardEnvelopeList } from "./DashboardEnvelopeList";

function Dashboard(): React.ReactElement {
  return (
    <div className={bs.row}>
      <div className={combine(bs.colSm12, bs.colMd8)}>
        <DashboardEnvelopeList />
        <DashboardBudgetList />
        <DashboardRateHistories />
      </div>
      <div className={combine(bs.colSm12, bs.colMd4)}>
        <DashboardAlertList />
        <DashboardAccountList />
      </div>
    </div>
  );
}

export { Dashboard };
