import React, { ReactElement } from "react";
import { useAsyncEffect } from "../../utils/hooks.js";
import { toastBus } from "../toaster/toaster.js";
import { useRouter } from "../app/router.js";
import { LoadingPanel } from "../common/loading/loading.js";
import { ErrorPanel } from "../common/error/error.js";
import { reportingServiceClient } from "../../../api/api.js";
import { HoldingBalance } from "../../../api_gen/moneydashboard/v4/reporting_pb.js";

function DashboardPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: [], title: "Dashboard" });
  }, []);

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

  let body: ReactElement;
  if (error) {
    body = <ErrorPanel error={error} />;
  } else if (!holdingBalances) {
    body = <LoadingPanel />;
  } else {
    body = (
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
    );
  }

  return (
    <>
      <div id={"content"} className={"overflow-auto"}>
        <section>{body}</section>
      </div>
    </>
  );
}

export { DashboardPage };
