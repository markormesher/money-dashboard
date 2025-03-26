import React, { ReactElement } from "react";
import { HoldingBalance } from "../../../api_gen/moneydashboard/v4/reporting_pb.js";
import { useAsyncEffect } from "../../utils/hooks.js";
import { reportingServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { ErrorPanel } from "../common/error/error.js";
import { LoadingPanel } from "../common/loading/loading.js";
import { concatClasses } from "../../utils/style.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { Account } from "../../../api_gen/moneydashboard/v4/accounts_pb.js";
import { formatCurrency } from "../../utils/currency.js";
import "./holding-balances-tile.css";
import { AccountGroup } from "../../../api_gen/moneydashboard/v4/account_groups_pb.js";
import { formatAsset } from "../../utils/assets.js";
import { GBP_CURRENCY, GBP_CURRENCY_ID } from "../../../config/consts.js";

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

  const [openAccounts, setOpenAccounts] = React.useState<string[]>([]);

  function toggleOpenAccount(id: string) {
    if (openAccounts.includes(id)) {
      setOpenAccounts(openAccounts.filter((a) => a != id));
    } else {
      setOpenAccounts([...openAccounts, id]);
    }
  }

  if (error) {
    return <ErrorPanel error={error} />;
  } else if (!holdingBalances) {
    return <LoadingPanel />;
  }

  const groups: Record<string, Group> = {};
  let totalBalance = 0;

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

    totalBalance += hb.gbpBalance;
    row.balanceSum += hb.gbpBalance;
    row.balances.push(hb);
  }

  return (
    <article className={"dashboard-balances-tile"}>
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
              <h6 className={"group-header"}>{g.accountGroup.name}</h6>
              {Object.values(g.rows)
                .sort((a, b) => Math.abs(b.balanceSum) - Math.abs(a.balanceSum))
                .map((r) => {
                  const { account, balances, balanceSum } = r;
                  const showHoldings = openAccounts.includes(account.id);

                  const label = (
                    <div className={"row-label"}>
                      <IconGroup>
                        <span>{account.name}</span>
                        {account.notes ? (
                          <span data-tooltip={account.notes}>
                            <Icon name={"info"} className={"muted"} />
                          </span>
                        ) : null}
                        {balances.length > 1 ? <Icon name={"account_tree"} className={"muted"} /> : null}
                      </IconGroup>
                    </div>
                  );

                  if (showHoldings) {
                    const subRows = balances
                      .sort((a, b) => b.gbpBalance - a.gbpBalance)
                      .map((b) => {
                        const { holding } = b;
                        let conversionNote = "";

                        if (holding?.asset) {
                          conversionNote = `${formatAsset(b.rawBalance, holding.asset)} ${holding.asset.name}`;
                        }

                        if (holding?.currency && holding.currency.id != GBP_CURRENCY_ID) {
                          conversionNote = `${formatCurrency(b.rawBalance, holding.currency)} ${holding.currency.code}`;
                        }

                        return (
                          <div className={"balance-row"}>
                            <div className={"row-label"}>
                              <IconGroup>
                                <span>{holding?.name}</span>
                                {conversionNote ? (
                                  <span data-tooltip={conversionNote}>
                                    <Icon name={"shuffle"} className={"muted"} />
                                  </span>
                                ) : null}
                              </IconGroup>
                            </div>
                            <div className={"row-value"}>{formatCurrency(b.gbpBalance, null)}</div>
                          </div>
                        );
                      });

                    return (
                      <div
                        className={concatClasses("balance-row", "with-children")}
                        onClick={() => toggleOpenAccount(account.id)}
                      >
                        {label}
                        <div className={"row-children"}>{subRows} </div>
                      </div>
                    );
                  } else {
                    return (
                      <div className={"balance-row"} onClick={() => toggleOpenAccount(account.id)}>
                        {label}
                        <div className={"row-value"}>{formatCurrency(balanceSum, null)}</div>
                      </div>
                    );
                  }
                })}
            </>
          );
        })}

      <footer>
        <div className={"total-balance"}>{formatCurrency(totalBalance, GBP_CURRENCY)}</div>
      </footer>
    </article>
  );
}

export { HoldingBalancesTile };
