import { faPiggyBank } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component, ReactNode } from "react";
import { IAccountBalance } from "../../../commons/models/IAccountBalance";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrency, formatCurrencyStyled } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import * as styles from "./DashboardAccountList.scss";

interface IDashboardAccountListProps {
  readonly accountBalances: IAccountBalance[];
}

class DashboardAccountList extends Component<IDashboardAccountListProps> {
  private static sortByAbsoluteBalanceComparator(a: IAccountBalance, b: IAccountBalance): number {
    return Math.abs(b.balance) - Math.abs(a.balance);
  }

  public render(): ReactNode {
    const { accountBalances } = this.props;
    return (
      <div className={bs.card}>
        <h5 className={combine(bs.cardHeader, bs.h5)}>
          <FontAwesomeIcon icon={faPiggyBank} className={bs.mr3} />
          Account Balances
        </h5>
        <div className={combine(bs.cardBody, gs.cardBody)}>
          {(!accountBalances && <LoadingSpinner centre={true} />) || this.renderInner()}
        </div>
      </div>
    );
  }

  private renderInner(): ReactNode {
    const balances = this.props.accountBalances.map((a) => a.balance);
    const total = balances.length ? balances.reduce((a, b) => a + b) : 0;
    return (
      <div className={styles.accountList}>
        {this.renderAccountBalanceList("current", "Current Accounts")}
        {this.renderAccountBalanceList("savings", "Savings Accounts")}
        {this.renderAccountBalanceList("asset", "Assets")}
        {this.renderAccountBalanceList("other", "Other")}
        <hr />
        <p className={styles.total}>£{formatCurrency(total)}</p>
      </div>
    );
  }

  private renderAccountBalanceList(type: string, title: string): ReactNode {
    const balances = this.props.accountBalances.filter((a) => a.account.type === type).filter((a) => a.balance !== 0);

    if (balances.length === 0) {
      return null;
    }

    return (
      <>
        <h6>{title}</h6>
        {balances.sort(DashboardAccountList.sortByAbsoluteBalanceComparator).map(this.renderSingleAccountBalance)}
      </>
    );
  }

  private renderSingleAccountBalance(balance: IAccountBalance): ReactNode {
    return (
      <p key={balance.account.id}>
        {balance.account.name}
        {balance.account.note && (
          <>
            {" "}
            <InfoIcon hoverText={balance.account.note} />
          </>
        )}
        <span className={bs.floatRight}>{formatCurrencyStyled(balance.balance)}</span>
      </p>
    );
  }
}

export { DashboardAccountList };
