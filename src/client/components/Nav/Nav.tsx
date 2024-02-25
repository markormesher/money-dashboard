import * as React from "react";
import { AccountApi } from "../../api/accounts";
import bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { sharedHistory } from "../../helpers/history";
import { NavContext } from "../App/App";
import style from "./Nav.scss";
import { NavLink } from "./NavLink";
import { NavSection } from "./NavSection";

function Nav(): React.ReactElement {
  const { navState } = React.useContext(NavContext);

  const [accountList, refreshAccountList] = AccountApi.useAccountList();
  React.useEffect(() => {
    refreshAccountList();
  }, []);

  const accounts = accountList;
  const activeAccounts = accounts ? accounts.filter((a) => a.active) : [];
  const hasAssetAccounts = activeAccounts.some((a) => a.type === "asset");
  const hasTaxYearAccounts = activeAccounts.some((a) => a.tags.includes("isa") || a.tags.includes("pension"));

  const wrapperClasses = combine(
    !navState.isOpen && bs.dNone,
    bs.dLgBlock,
    bs.col12,
    bs.colLg2,
    bs.p0,
    bs.bgLight,
    style.sidebar,
  );

  return (
    <>
      <KeyShortcut targetStr={"gd"} onTrigger={() => sharedHistory.push("/")} />
      <KeyShortcut targetStr={"gt"} onTrigger={() => sharedHistory.push("/transactions")} />

      <nav className={wrapperClasses}>
        <div className={style.sidebarSticky}>
          <NavSection>
            <NavLink to="/" text="Dashboard" icon={"home"} />
            <NavLink to="/transactions" text="Transactions" icon={"table"} />
          </NavSection>

          <NavSection title="Planning">
            <NavLink to="/budgets" text="Budgets" icon={"tune"} />
            <NavLink to="/envelopes" text="Envelopes" icon={"mail"} />
            <NavLink to="/envelope-transfers" text="Envelope Transfers" icon={"swap_horiz"} />
          </NavSection>

          <NavSection title="Reports">
            <NavLink to="/reports/balance-history" text="Balance History" icon={"trending_up"} />
            {hasAssetAccounts && (
              <NavLink to="/reports/asset-performance" text="Asset Performance" icon={"monitoring"} />
            )}
            {hasTaxYearAccounts && (
              <NavLink to="/reports/tax-year-deposits" text="Tax Year Deposits" icon={"savings"} />
            )}
          </NavSection>

          <NavSection title="Settings">
            <NavLink to="/accounts" text="Accounts" icon={"account_balance_wallet"} />
            <NavLink to="/categories" text="Categories" icon={"bookmarks"} />
            <NavLink to="/profiles" text="Profiles" icon={"group"} />
          </NavSection>
        </div>
      </nav>
    </>
  );
}

export { Nav };
