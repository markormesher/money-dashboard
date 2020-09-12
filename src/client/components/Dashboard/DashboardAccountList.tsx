import { faCaretRight, faCaretDown, faWallet } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component, ReactNode, MouseEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IAccountBalance } from "../../../commons/models/IAccountBalance";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrencyStyled, formatCurrencyForStat } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import { Card } from "../_ui/Card/Card";
import * as styles from "./DashboardAccountList.scss";

interface IDashboardAccountListProps {
  readonly accountBalances: IAccountBalance[];
}

interface IDashboardAccountListState {
  readonly sectionOpen: { [key: string]: boolean };
}

class DashboardAccountList extends Component<IDashboardAccountListProps, IDashboardAccountListState> {
  private static sortByAbsoluteBalanceComparator(a: IAccountBalance, b: IAccountBalance): number {
    return Math.abs(b.balance) - Math.abs(a.balance);
  }

  constructor(props: IDashboardAccountListProps) {
    super(props);
    this.state = {
      sectionOpen: {},
    };

    this.renderAccountBalanceList = this.renderAccountBalanceList.bind(this);
    this.handleSectionOpenToggle = this.handleSectionOpenToggle.bind(this);
  }

  public render(): ReactNode {
    const { accountBalances } = this.props;

    if (!accountBalances) {
      return (
        <Card title={"Account Balances"} icon={faWallet}>
          <LoadingSpinner centre={true} />
        </Card>
      );
    }

    const total = accountBalances.length ? accountBalances.map((ab) => ab.balance).reduce((a, b) => a + b) : 0;

    return (
      <Card title={"Account Balances"} icon={faWallet}>
        <div className={styles.accountList}>
          {this.renderAccountBalanceList("current", "Current Accounts")}
          {this.renderAccountBalanceList("savings", "Savings Accounts")}
          {this.renderAccountBalanceList("asset", "Assets")}
          {this.renderAccountBalanceList("other", "Other")}
          <hr />
          <p className={combine(gs.bigStatValue, bs.textRight)}>{formatCurrencyForStat(total)}</p>
        </div>
      </Card>
    );
  }

  private renderAccountBalanceList(type: string, title: string): ReactNode {
    const balances = this.props.accountBalances.filter((a) => a.account.type === type).filter((a) => a.balance !== 0);

    if (balances.length === 0) {
      return null;
    }

    const sectionOpen = this.state.sectionOpen[type] || false;

    if (sectionOpen) {
      return (
        <>
          <h6 onClick={this.handleSectionOpenToggle} id={`section-header-${type}`}>
            <FontAwesomeIcon icon={faCaretDown} className={combine(bs.textMuted, bs.mr2)} />
            {title}
          </h6>
          {balances.sort(DashboardAccountList.sortByAbsoluteBalanceComparator).map(this.renderSingleAccountBalance)}
        </>
      );
    } else {
      const total = balances.map((b) => b.balance).reduce((a, b) => a + b);
      return (
        <>
          <h6 onClick={this.handleSectionOpenToggle} id={`section-header-${type}`}>
            <FontAwesomeIcon icon={faCaretRight} className={combine(bs.textMuted, bs.mr2)} />
            {title}
            <span className={bs.floatRight}>{formatCurrencyStyled(total)}</span>
          </h6>
        </>
      );
    }
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

  private handleSectionOpenToggle(event: MouseEvent<HTMLHeadingElement>): void {
    const sectionType = (event.target as HTMLHeadingElement).id.replace("section-header-", "");
    const oldState = this.state.sectionOpen;
    this.setState({ sectionOpen: { ...oldState, [sectionType]: !oldState[sectionType] } });
  }
}

export { DashboardAccountList };
