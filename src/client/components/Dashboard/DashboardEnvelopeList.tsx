import * as React from "react";
import { PureComponent, ReactNode } from "react";
import axios from "axios";
import { IEnvelopeBalance } from "../../../models/IEnvelopeBalance";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatCurrency } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { Card } from "../_ui/Card/Card";
import { mapEnvelopeFromApi } from "../../../models/IEnvelope";
import * as styles from "./DashboardEnvelopeList.scss";

/*
 * NOTE: this component works very differently to the other components (i.e. gets rid of most of the Redux nonsense).
 * The app will gradually be re-written to get rid of some of the over-use of Redux. This component is the first to be written
 * like this because there was no point writing it in the old style only to re-write it shortly after.
 */

type DashboardEnvelopeListState = {
  readonly envelopeBalances: IEnvelopeBalance[];
};

class DashboardEnvelopeList extends PureComponent<unknown, DashboardEnvelopeListState> {
  constructor(props: unknown) {
    super(props);

    this.state = { envelopeBalances: null };
  }

  public async componentDidMount(): Promise<void> {
    // get data
    const response = await axios.get("/api/envelopes/balances");
    const raw: IEnvelopeBalance[] = response.data;
    const envelopeBalances = raw.map((rawItem) => ({
      ...rawItem,
      envelope: mapEnvelopeFromApi(rawItem.envelope),
    }));
    this.setState({ envelopeBalances });
  }

  public render(): ReactNode {
    const { envelopeBalances } = this.state;
    if (envelopeBalances == null) {
      return <LoadingSpinner centre={true} />;
    } else if (envelopeBalances.length == 1) {
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
              <p className={combine(envelopeBalance.balance < 0 && bs.textDanger)}>
                {formatCurrency(envelopeBalance.balance)}
              </p>
            </div>
          ))}
        </div>
        {unallocatedBalance.balance == 0 ? null : (
          <>
            <hr />
            <p>
              <strong>Unallocated funds:</strong> {formatCurrency(unallocatedBalance.balance)}
            </p>
          </>
        )}
      </Card>
    );
  }
}

export { DashboardEnvelopeList };
