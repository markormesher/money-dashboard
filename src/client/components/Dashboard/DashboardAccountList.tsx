import { faCaretRight, faCaretDown, faWallet, faSyncAlt } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component, ReactNode, MouseEvent, ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IAccountBalance } from "../../../commons/models/IAccountBalance";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrencyStyled, formatCurrencyForStat, formatCurrency } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import { Card } from "../_ui/Card/Card";
import { ExchangeRateMap } from "../../../commons/models/IExchangeRate";
import { DEFAULT_CURRENCY_CODE, getCurrency } from "../../../commons/models/ICurrency";
import * as styles from "./DashboardAccountList.scss";

interface IDashboardAccountListProps {
  readonly accountBalances: IAccountBalance[];
  readonly exchangeRates: ExchangeRateMap;
}

interface IDashboardAccountListState {
  readonly sectionClosed: { [key: string]: boolean };
}

class DashboardAccountList extends Component<IDashboardAccountListProps, IDashboardAccountListState> {
  private static sortByAbsoluteBalanceComparator(a: IAccountBalance, b: IAccountBalance): number {
    return Math.abs(b.balance) - Math.abs(a.balance);
  }

  constructor(props: IDashboardAccountListProps) {
    super(props);
    this.state = {
      sectionClosed: {},
    };

    this.renderAccountBalanceList = this.renderAccountBalanceList.bind(this);
    this.renderSingleAccountBalance = this.renderSingleAccountBalance.bind(this);
    this.handleSectionClosedToggle = this.handleSectionClosedToggle.bind(this);
  }

  public render(): ReactNode {
    const { accountBalances, exchangeRates } = this.props;

    if (!accountBalances || !exchangeRates) {
      return (
        <Card title={"Account Balances"} icon={faWallet}>
          <LoadingSpinner centre={true} />
        </Card>
      );
    }

    const total = accountBalances
      .map((ab) => ab.balance / exchangeRates[ab.account.currencyCode].ratePerGbp)
      .reduce((a, b) => a + b, 0);

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
    const { exchangeRates } = this.props;
    const balances = this.props.accountBalances.filter((a) => a.account.type === type).filter((a) => a.balance !== 0);

    if (balances.length === 0) {
      return null;
    }

    const sectionClosed = this.state.sectionClosed[type] || false;

    if (sectionClosed) {
      const total = balances
        .map((b) => b.balance / exchangeRates[b.account.currencyCode].ratePerGbp)
        .reduce((a, b) => a + b);
      return (
        <>
          <h6 onClick={this.handleSectionClosedToggle} id={`section-header-${type}`}>
            <FontAwesomeIcon icon={faCaretRight} className={combine(bs.textMuted, bs.mr2)} fixedWidth={true} />
            {title}
            <span className={bs.floatRight}>{formatCurrencyStyled(total)}</span>
          </h6>
        </>
      );
    } else {
      return (
        <>
          <h6 onClick={this.handleSectionClosedToggle} id={`section-header-${type}`}>
            <FontAwesomeIcon icon={faCaretDown} className={combine(bs.textMuted, bs.mr2)} fixedWidth={true} />
            {title}
          </h6>
          {balances.sort(DashboardAccountList.sortByAbsoluteBalanceComparator).map(this.renderSingleAccountBalance)}
        </>
      );
    }
  }

  private renderSingleAccountBalance(balance: IAccountBalance): ReactNode {
    const { exchangeRates } = this.props;

    const account = balance.account;
    const currency = getCurrency(account.currencyCode);
    const exchangeRate = exchangeRates[currency.code];
    const gbpBalance = balance.balance / exchangeRate.ratePerGbp;
    const icons: ReactElement[] = [];

    if (account.note) {
      icons.push(
        <span className={bs.ml2} key={`account-${account.id}-note`}>
          <InfoIcon hoverText={account.note} />
        </span>,
      );
    }

    if (account.currencyCode !== DEFAULT_CURRENCY_CODE) {
      const currencyNote =
        `${currency.htmlSymbol}${formatCurrency(balance.balance)} converted at` +
        ` 1 ${currency.code} = ${formatCurrency(1 / exchangeRate.ratePerGbp)} ${DEFAULT_CURRENCY_CODE}`;
      icons.push(
        <span className={bs.ml2} key={`account-${account.id}-currency`}>
          <InfoIcon hoverText={currencyNote} customIcon={faSyncAlt} />
        </span>,
      );
    }

    return (
      <p key={account.id}>
        {account.name}
        {icons}
        <span className={bs.floatRight}>{formatCurrencyStyled(gbpBalance)}</span>
      </p>
    );
  }

  private handleSectionClosedToggle(event: MouseEvent<HTMLHeadingElement>): void {
    const sectionType = (event.target as HTMLHeadingElement).id.replace("section-header-", "");
    const oldState = this.state.sectionClosed;
    this.setState({ sectionClosed: { ...oldState, [sectionType]: !oldState[sectionType] } });
  }
}

export { DashboardAccountList };
