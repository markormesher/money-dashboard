import * as React from "react";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrency } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { Card } from "../_ui/Card/Card";
import { EnvelopeApi } from "../../api/envelopes";
import * as styles from "./DashboardEnvelopeList.scss";

function DashboardEnvelopeList(): React.ReactElement | null {
  const [envelopeBalances, refreshEnvelopeBalances] = EnvelopeApi.useEnvelopeBalances();
  React.useEffect(() => {
    refreshEnvelopeBalances();
  }, []);

  if (envelopeBalances == undefined) {
    return <LoadingSpinner centre={true} />;
  } else if (envelopeBalances.length <= 1) {
    // just 1 = only unallocated funds
    return null;
  }

  const allocatedBalances = envelopeBalances.filter((b) => b.envelope != null);
  allocatedBalances.sort((a, b) => a.envelope.name.localeCompare(b.envelope.name));

  const unallocatedBalance = envelopeBalances.filter((b) => b.envelope == null)[0];

  return (
    <Card title={"Envelope Balances"} icon={"mail"}>
      <div className={bs.row}>
        {allocatedBalances.map((envelopeBalance) => (
          <div
            key={envelopeBalance.envelope.id}
            className={combine(bs.col12, bs.colSm6, bs.colMd4, styles.envelopeBalance)}
          >
            <p>
              <strong>{envelopeBalance.envelope.name}</strong>
            </p>
            <p
              className={combine(
                gs.currency,
                envelopeBalance.balance == 0 && bs.textMuted,
                envelopeBalance.balance < 0 && bs.textDanger,
              )}
            >
              {formatCurrency(envelopeBalance.balance)}
            </p>
          </div>
        ))}
        {unallocatedBalance.balance == 0 ? null : (
          <div className={combine(bs.col12, bs.colSm6, bs.colMd4, styles.envelopeBalance)}>
            <p>
              <strong>
                <i>Unallocated funds</i>
              </strong>
            </p>
            <p className={combine(gs.currency, unallocatedBalance.balance < 0 && bs.textDanger)}>
              <i>{formatCurrency(unallocatedBalance.balance)}</i>
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export { DashboardEnvelopeList };
