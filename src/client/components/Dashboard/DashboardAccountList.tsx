import { faCaretRight, faCaretDown, faWallet, faRandom, faEdit } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component, ReactNode, MouseEvent, ReactElement } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { Dispatch, AnyAction } from "redux";
import { IAccountBalance } from "../../../models/IAccountBalance";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrencyStyled, formatCurrencyForStat, formatCurrency } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import { Card } from "../_ui/Card/Card";
import { AccountType } from "../../../models/IAccount";
import { ExchangeRateMap } from "../../../models/IExchangeRate";
import { DEFAULT_CURRENCY_CODE, getCurrency } from "../../../models/ICurrency";
import { IRootState } from "../../redux/root";
import { setAssetBalanceToUpdate } from "../../redux/dashboard";
import * as styles from "./DashboardAccountList.scss";

interface IDashboardAccountListProps {
  readonly accountBalances: IAccountBalance[];
  readonly exchangeRates: ExchangeRateMap;

  readonly actions?: {
    readonly setAssetBalanceToUpdate: (assetBalance: IAccountBalance) => AnyAction;
  };
}

interface IDashboardAccountListState {
  readonly sectionClosed: { [key: string]: boolean };
}

function mapStateToProps(_state: IRootState, props: IDashboardAccountListProps): IDashboardAccountListProps {
  return {
    ...props,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IDashboardAccountListProps): IDashboardAccountListProps {
  return {
    ...props,
    actions: {
      setAssetBalanceToUpdate: (assetBalance: IAccountBalance): AnyAction =>
        dispatch(setAssetBalanceToUpdate(assetBalance)),
    },
  };
}

class UCDashboardAccountList extends Component<IDashboardAccountListProps, IDashboardAccountListState> {
  constructor(props: IDashboardAccountListProps) {
    super(props);
    this.state = {
      sectionClosed: {},
    };

    this.renderAccountBalanceList = this.renderAccountBalanceList.bind(this);
    this.renderSingleAccountBalance = this.renderSingleAccountBalance.bind(this);
    this.compareAbsoluteGbpBalances = this.compareAbsoluteGbpBalances.bind(this);
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
          <p className={combine(gs.bigStatValue, bs.textEnd)}>{formatCurrencyForStat(total)}</p>
        </div>
      </Card>
    );
  }

  private renderAccountBalanceList(type: AccountType, title: string): ReactNode {
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
            <FontAwesomeIcon icon={faCaretRight} className={combine(bs.textMuted, bs.me2)} fixedWidth={true} />
            {title}
            <span className={bs.floatEnd}>{formatCurrencyStyled(total)}</span>
          </h6>
        </>
      );
    } else {
      return (
        <>
          <h6 onClick={this.handleSectionClosedToggle} id={`section-header-${type}`}>
            <FontAwesomeIcon icon={faCaretDown} className={combine(bs.textMuted, bs.me2)} fixedWidth={true} />
            {title}
          </h6>
          {balances.sort(this.compareAbsoluteGbpBalances).map(this.renderSingleAccountBalance)}
        </>
      );
    }
  }

  private renderSingleAccountBalance(balance: IAccountBalance): ReactNode {
    const { exchangeRates } = this.props;
    const setAssetBalanceToUpdate = this.props.actions.setAssetBalanceToUpdate;

    const account = balance.account;
    const currency = getCurrency(account.currencyCode);
    const exchangeRate = exchangeRates[currency.code];
    const gbpBalance = balance.balance / exchangeRate.ratePerGbp;
    const icons: ReactElement[] = [];

    if (account.note) {
      icons.push(
        <span className={bs.ms2} key={`account-${account.id}-note`}>
          <InfoIcon hoverText={account.note} />
        </span>,
      );
    }

    if (account.currencyCode !== DEFAULT_CURRENCY_CODE) {
      const currencyNote =
        `${currency.stringSymbol}${formatCurrency(balance.balance)} converted at 1 ${currency.code} = ` +
        `${formatCurrency(1 / exchangeRate.ratePerGbp)} ${DEFAULT_CURRENCY_CODE}`;
      icons.push(
        <span className={bs.ms2} key={`account-${account.id}-currency`}>
          <InfoIcon hoverText={currencyNote} customIcon={faRandom} />
        </span>,
      );
    }

    if (account.type === "asset") {
      icons.push(
        <span className={combine(bs.ms2, styles.editIcon)} key={`account-${account.id}-update`}>
          <InfoIcon
            hoverText={"Update balance"}
            customIcon={faEdit}
            payload={balance}
            onClick={setAssetBalanceToUpdate}
          />
        </span>,
      );
    }

    return (
      <p key={account.id}>
        {account.name}
        {icons}
        <span className={bs.floatEnd}>{formatCurrencyStyled(gbpBalance)}</span>
      </p>
    );
  }

  private compareAbsoluteGbpBalances(a: IAccountBalance, b: IAccountBalance): number {
    const { exchangeRates } = this.props;
    const aBalance = a.balance / exchangeRates[a.account.currencyCode].ratePerGbp;
    const bBalance = b.balance / exchangeRates[b.account.currencyCode].ratePerGbp;
    return Math.abs(bBalance) - Math.abs(aBalance);
  }

  private handleSectionClosedToggle(event: MouseEvent<HTMLHeadingElement>): void {
    const sectionType = (event.target as HTMLHeadingElement).id.replace("section-header-", "");
    const oldState = this.state.sectionClosed;
    this.setState({ sectionClosed: { ...oldState, [sectionType]: !oldState[sectionType] } });
  }
}

export const DashboardAccountList = connect(mapStateToProps, mapDispatchToProps)(UCDashboardAccountList);
