import React, { ReactElement } from "react";
import { CategoryBalance } from "../../../api_gen/moneydashboard/v4/reporting_pb.js";
import { useAsyncEffect } from "../../utils/hooks.js";
import { reportingServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { ErrorPanel } from "../common/error/error.js";
import { LoadingPanel } from "../common/loading/loading.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import "./holding-balances-tile.css";
import { formatAssetValue } from "../../utils/assets.js";
import { formatCurrencyValue } from "../../utils/currency.js";
import { GBP_CURRENCY_ID } from "../../../config/consts.js";
import "./warnings-tile.css";

function WarningsTile(): ReactElement | null {
  const [error, setError] = React.useState<unknown>();
  const [nonZeroMemoBalances, setNonZeroMemoBalances] = React.useState<CategoryBalance[]>();
  useAsyncEffect(async () => {
    try {
      const res = await reportingServiceClient.getNonZeroMemoBalances({});
      setNonZeroMemoBalances(res.balances);
    } catch (e) {
      toastBus.error("Failed to load memo balances.");
      setError(e);
      console.log(e);
    }
  }, []);

  if (error) {
    return <ErrorPanel error={error} />;
  } else if (!nonZeroMemoBalances) {
    return <LoadingPanel />;
  }

  const warnings: ReactElement[] = [];

  nonZeroMemoBalances
    .sort((a, b) => a.category?.name.localeCompare(b.category?.name ?? "") ?? 0)
    .forEach((balance) => {
      let unit = "";
      let amount = "0.00";
      if (balance.asset) {
        unit = balance.asset.name;
        amount = formatAssetValue(balance.rawBalance, balance.asset);
      }
      if (balance.currency) {
        if (balance.currency.id != GBP_CURRENCY_ID) {
          unit = balance.currency.code;
        }
        amount = formatCurrencyValue(balance.rawBalance, balance.currency);
      }

      warnings.push(
        <p>
          {balance.category?.name}
          {unit ? ` (${unit})` : ""} balance is <span className={"amount"}>{amount}</span>.
        </p>,
      );
    });

  if (warnings.length === 0) {
    return null;
  }

  return (
    <article className={"dashboard-warnings-tile"}>
      <header>
        <h4 className={"mb0"}>
          <IconGroup>
            <Icon name={"warning"} className={"colour-red"} />
            <span>Warnings</span>
          </IconGroup>
        </h4>
      </header>
      {warnings}
    </article>
  );
}

export { WarningsTile };
