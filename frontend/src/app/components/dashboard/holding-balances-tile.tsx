import React, { ReactElement } from "react";
import { HoldingBalance } from "../../../api_gen/moneydashboard/v4/reporting_pb.js";
import { useAsyncEffect } from "../../utils/hooks.js";
import { reportingServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { ErrorPanel } from "../common/error/error.js";
import { LoadingPanel } from "../common/loading/loading.js";
import { concatClasses } from "../../utils/style.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { Account, AccountGroup } from "../../../api_gen/moneydashboard/v4/accounts_pb.js";
import { formatCurrency } from "../../utils/currency.js";
import "./holding-balances-tile.css";

type Group = {
  accountGroup: AccountGroup;
  rows: Record<string, GroupRow>;
};

type GroupRow = {
  account: Account;
  balances: HoldingBalance[];
  balanceSum: number;
};

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

  const [showHoldings, setShowHoldings] = React.useState(false);

  if (error) {
    return <ErrorPanel error={error} />;
  } else if (!holdingBalances) {
    return <LoadingPanel />;
  }

  const groups: Record<string, Group> = {};

  for (const hb of holdingBalances) {
    const account = hb.holding?.account;
    const accountGroup = account?.accountGroup;
    if (!account || !accountGroup) {
      // we don't expect this to actually happen, it just makes the typing cleaner below
      continue;
    }

    let group = groups[accountGroup.id];
    if (!group) {
      group = { accountGroup, rows: {} };
      groups[accountGroup.id] = group;
    }

    let row = group.rows[account.id];
    if (!row) {
      row = { account, balances: [], balanceSum: 0 };
      group.rows[account.id] = row;
    }

    row.balanceSum += hb.gbpBalance;
    row.balances.push(hb);
  }

  return (
    <article>
      <header>
        <h4 className={"mb0"}>
          <IconGroup>
            <Icon name={"account_balance"} />
            <span>Account Balances</span>
          </IconGroup>
        </h4>
      </header>

      {Object.values(groups)
        .sort((a, b) => a.accountGroup.displayOrder - b.accountGroup.displayOrder)
        .map((g) => {
          return (
            <>
              <h6>{g.accountGroup.name}</h6>
              {Object.values(g.rows)
                .sort((a, b) => Math.abs(b.balanceSum) - Math.abs(a.balanceSum))
                .map((r) => {
                  if (!showHoldings || r.balances.length == 1) {
                    return (
                      <div className={"balance-row"}>
                        <div className={"row-label"}>{r.account.name}</div>
                        <div className={"row-value"}>{formatCurrency(r.balanceSum, null)}</div>
                      </div>
                    );
                  }

                  return (
                    <div className={concatClasses("balance-row", "with-children")}>
                      <div className={"row-label"}>{r.account.name}</div>
                      <div className={"row-children"}>
                        {r.balances
                          .sort((a, b) => b.gbpBalance - a.gbpBalance)
                          .map((b) => {
                            return (
                              <div className={"balance-row"}>
                                <div className={"row-label"}>{b.holding?.name}</div>
                                <div className={"row-value"}>{formatCurrency(b.gbpBalance, null)}</div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
            </>
          );
        })}

      <footer>
        <fieldset className={concatClasses("mb0", "muted")}>
          <label>
            <input
              type={"checkbox"}
              role={"switch"}
              checked={showHoldings}
              onChange={(evt) => setShowHoldings(evt.target.checked)}
            />
            Individual holdings
          </label>
        </fieldset>
      </footer>
    </article>
  );
}

export { HoldingBalancesTile };
