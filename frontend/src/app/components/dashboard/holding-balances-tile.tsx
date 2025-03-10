import React, { ReactElement } from "react";
import { HoldingBalance } from "../../../api_gen/moneydashboard/v4/reporting_pb.js";
import { useAsyncEffect } from "../../utils/hooks.js";
import { reportingServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { ErrorPanel } from "../common/error/error.js";
import { LoadingPanel } from "../common/loading/loading.js";

function HoldingBalancesTile(): ReactElement {
  const [error, setError] = React.useState<unknown>();
  const [holdingBalances, setHoldingBalances] = React.useState<HoldingBalance[]>();

  useAsyncEffect(async () => {
    try {
      const res = await reportingServiceClient.getHoldingBalances({});
      setHoldingBalances(res.balances.filter((b) => b.gbpBalance != 0));
    } catch (e) {
      toastBus.error("Failed to load holding balances.");
      setError(e);
      console.log(e);
    }
  }, []);

  if (error) {
    return <ErrorPanel error={error} />;
  } else if (!holdingBalances) {
    return <LoadingPanel />;
  }

  return (
    <article>
      <ul>
        {holdingBalances.map((b) => {
          return (
            <li>
              {b.holding?.account?.name} / {b.holding?.name} / {b.rawBalance} ( = {b.gbpBalance})
            </li>
          );
        })}
        <li>Total = {holdingBalances.map((b) => b.gbpBalance).reduce((a, b) => a + b)}</li>
      </ul>
    </article>
  );
}

export { HoldingBalancesTile };
