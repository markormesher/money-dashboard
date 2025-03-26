import React, { ReactElement } from "react";
import { EnvelopeBalance } from "../../../api_gen/moneydashboard/v4/reporting_pb.js";
import { useAsyncEffect } from "../../utils/hooks.js";
import { reportingServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { ErrorPanel } from "../common/error/error.js";
import { LoadingPanel } from "../common/loading/loading.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import "./holding-balances-tile.css";
import { formatCurrency } from "../../utils/currency.js";
import "./envelope-balances-tile.css";
import { NULL_UUID } from "../../../config/consts.js";
import { concatClasses } from "../../utils/style.js";

function EnvelopeBalancesTile(): ReactElement | null {
  const [error, setError] = React.useState<unknown>();
  const [envelopeBalances, setEnvelopeBalances] = React.useState<EnvelopeBalance[]>();
  useAsyncEffect(async () => {
    try {
      const res = await reportingServiceClient.getEnvelopeBalances({});
      setEnvelopeBalances(res.balances);
    } catch (e) {
      toastBus.error("Failed to load envelope balances.");
      setError(e);
      console.log(e);
    }
  }, []);

  if (error) {
    return <ErrorPanel error={error} />;
  } else if (!envelopeBalances) {
    return <LoadingPanel />;
  }

  // show nothing if we only have a single balance of unallocated funds
  if (envelopeBalances.length <= 1) {
    return null;
  }

  const unallocatedBalance = envelopeBalances.find((b) => b.envelope?.id == NULL_UUID)?.gbpBalance ?? 0;
  const balances: ReactElement[] = [];

  envelopeBalances
    .filter((b) => b.envelope?.id != NULL_UUID)
    .sort((a, b) => a.envelope?.name.localeCompare(b.envelope?.name ?? "") ?? 0)
    .forEach((balance) => {
      balances.push(
        <div className={"balance"}>
          <strong>{balance.envelope?.name}</strong>
          <br />
          <span
            className={concatClasses(
              "amount",
              balance.gbpBalance == 0 && "muted",
              balance.gbpBalance < 0 && "colour-red",
            )}
          >
            {formatCurrency(balance.gbpBalance, null)}
          </span>
        </div>,
      );
    });

  if (balances.length === 0) {
    return null;
  }

  return (
    <article className={"dashboard-envelope-balances-tile"}>
      <header>
        <h4 className={"mb0"}>
          <IconGroup>
            <Icon name={"mail"} />
            <span>Envelope Balances</span>
          </IconGroup>
        </h4>
      </header>
      <div className={"balances"}>{balances}</div>
      {unallocatedBalance != 0 ? (
        <>
          <hr />
          <p>
            <strong>Unallocated balance:</strong>{" "}
            <span className={concatClasses("amount", unallocatedBalance < 0 && "colour-red")}>
              {formatCurrency(unallocatedBalance, null)}
            </span>
          </p>
        </>
      ) : null}
    </article>
  );
}

export { EnvelopeBalancesTile };
