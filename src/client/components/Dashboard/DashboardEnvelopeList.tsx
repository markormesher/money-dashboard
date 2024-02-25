import * as React from "react";
import { IEnvelopeBalance } from "../../../models/IEnvelopeBalance";
import bs from "../../global-styles/Bootstrap.scss";
import gs from "../../global-styles/Global.scss";
import { formatCurrency } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { Card } from "../_ui/Card/Card";
import { EnvelopeApi } from "../../api/envelopes";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import styles from "./DashboardEnvelopeList.scss";

function DashboardEnvelopeList(): React.ReactElement | null {
  const [envelopeBalances, setEnvelopeBalances] = React.useState<IEnvelopeBalance[]>();
  React.useEffect(() => {
    EnvelopeApi.getEnvelopeBalancess()
      .then(setEnvelopeBalances)
      .catch((err) => {
        globalErrorManager.emitNonFatalError("Failed to load envelope balances", err);
        setEnvelopeBalances([]);
      });
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
            <p className={combine(gs.currency, envelopeBalance.balance < 0 && bs.textDanger)}>
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
