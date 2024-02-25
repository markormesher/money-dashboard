import * as React from "react";
import { IAccountBalance } from "../../../models/IAccountBalance";
import bs from "../../global-styles/Bootstrap.scss";
import gs from "../../global-styles/Global.scss";
import { formatCurrencyStyled, formatCurrencyForStat, formatCurrency } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import { Card } from "../_ui/Card/Card";
import { AccountType } from "../../../models/IAccount";
import { DEFAULT_CURRENCY_CODE, getCurrency } from "../../../models/ICurrency";
import { MaterialIcon } from "../_ui/MaterialIcon/MaterialIcon";
import { ExchangeRateApi } from "../../api/exchange-rates";
import { AccountApi } from "../../api/accounts";
import { StockPriceApi } from "../../api/stock-prices";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { useNonceState } from "../../helpers/state-hooks";
import styles from "./DashboardAccountList.scss";
import { AssetBalanceUpdateModal } from "./AssetBalanceUpdateModal";

function DashboardAccountList(): React.ReactElement | null {
  const [nonce, updateNonce] = useNonceState();
  const [exchangeRates, refreshExchangeRates] = ExchangeRateApi.useLatestExchangeRates();
  const [stockPrices, refreshStockPrices] = StockPriceApi.useLatestStockPrices();
  React.useEffect(() => {
    refreshExchangeRates();
    refreshStockPrices();
  }, []);

  const [accountBalances, setAccountBalances] = React.useState<IAccountBalance[]>();
  React.useEffect(() => {
    AccountApi.getAccountBalances()
      .then(setAccountBalances)
      .catch((err) => {
        globalErrorManager.emitNonFatalError("Failed to load account balances", err);
        setAccountBalances([]);
      });
  }, [nonce]);

  const [sectionsClosed, setSectionsClosed] = React.useState<AccountType[]>([]);

  const [balanceToUpdate, setBalanceToUpdate] = React.useState<IAccountBalance>();

  if (!accountBalances || !exchangeRates || !stockPrices) {
    return (
      <Card title={"Account Balances"} icon={"account_balance_wallet"}>
        <LoadingSpinner centre={true} />
      </Card>
    );
  }

  function toggleSectionClosed(type: AccountType): void {
    if (sectionsClosed.includes(type)) {
      setSectionsClosed(sectionsClosed.filter((t) => t != type));
    } else {
      setSectionsClosed([...sectionsClosed, type]);
    }
  }

  function getGbpBalance(accountBalance: IAccountBalance): number {
    const account = accountBalance.account;
    const exchangeRate = exchangeRates?.[account.currencyCode]?.ratePerGbp ?? 1;
    let stockPrice = 1;
    if (account.stockTicker != null) {
      stockPrice = stockPrices?.[account.stockTicker]?.ratePerBaseCurrency ?? 1;
    }
    return (accountBalance.balance * stockPrice) / exchangeRate;
  }

  function compareAbsoluteGbpBalances(a: IAccountBalance, b: IAccountBalance): number {
    const aBalance = getGbpBalance(a);
    const bBalance = getGbpBalance(b);
    return Math.abs(bBalance) - Math.abs(aBalance);
  }

  function renderAccountBalanceList(
    accountBalances: IAccountBalance[],
    type: AccountType,
    title: string,
  ): React.ReactElement | null {
    const balances = accountBalances.filter((a) => a.account.type === type).filter((a) => a.balance !== 0);

    if (balances.length === 0) {
      return null;
    }

    const sectionClosed = sectionsClosed.includes(type);

    if (sectionClosed) {
      const total = balances.map(getGbpBalance).reduce((a, b) => a + b);
      return (
        <>
          <h6 onClick={() => toggleSectionClosed(type)} id={`section-header-${type}`}>
            <MaterialIcon icon={"folder"} className={combine(bs.textMuted, bs.me2)} />
            {title}
            <span className={bs.floatEnd}>{formatCurrencyStyled(total)}</span>
          </h6>
        </>
      );
    } else {
      return (
        <>
          <h6 onClick={() => toggleSectionClosed(type)} id={`section-header-${type}`}>
            <MaterialIcon icon={"folder_open"} className={combine(bs.textMuted, bs.me2)} />
            {title}
          </h6>
          {balances.sort(compareAbsoluteGbpBalances).map(renderSingleAccountBalance)}
        </>
      );
    }
  }

  function renderSingleAccountBalance(balance: IAccountBalance): React.ReactElement {
    const account = balance.account;
    const exchangeRate = exchangeRates?.[account.currencyCode]?.ratePerGbp ?? 1;
    let stockPrice = 1;
    if (account.stockTicker != null) {
      stockPrice = stockPrices?.[account.stockTicker]?.ratePerBaseCurrency ?? 1;
    }

    const currency = getCurrency(account.currencyCode);
    const gbpBalance = getGbpBalance(balance);
    const icons: React.ReactElement[] = [];

    if (account.note) {
      icons.push(
        <span className={bs.ms2} key={`account-${account.id}-note`}>
          <InfoIcon hoverText={account.note} />
        </span>,
      );
    }

    if (account.stockTicker !== null) {
      const gbpStockPrice = stockPrice / exchangeRate;
      const stockNote =
        `${formatCurrency(balance.balance)} ${currency.stringSymbol}${account.stockTicker} @` +
        ` ${formatCurrency(stockPrice)} ${account.currencyCode}` +
        (account.currencyCode != DEFAULT_CURRENCY_CODE
          ? ` (= ${formatCurrency(gbpStockPrice)} ${DEFAULT_CURRENCY_CODE})`
          : "");
      icons.push(
        <span className={bs.ms2} key={`account-${account.id}-stock`}>
          <InfoIcon hoverText={stockNote} customIcon={"trending_up"} />
        </span>,
      );
    } else if (account.currencyCode !== DEFAULT_CURRENCY_CODE) {
      const gbpRate = 1 / exchangeRate;
      const currencyNote =
        `${currency.stringSymbol}${formatCurrency(balance.balance)} ${account.currencyCode} @ 1` +
        ` = ${formatCurrency(gbpRate)} ${DEFAULT_CURRENCY_CODE}`;
      icons.push(
        <span className={bs.ms2} key={`account-${account.id}-currency`}>
          <InfoIcon hoverText={currencyNote} customIcon={"shuffle"} />
        </span>,
      );
    }

    if (account.type === "asset" && account.stockTicker === null) {
      icons.push(
        <span className={combine(bs.ms2, styles.editIcon)} key={`account-${account.id}-update`}>
          <InfoIcon
            hoverText={"Update balance"}
            customIcon={"edit"}
            payload={balance}
            onClick={() => setBalanceToUpdate(balance)}
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

  const total = accountBalances.map(getGbpBalance).reduce((a, b) => a + b, 0);
  return (
    <>
      {balanceToUpdate ? (
        <AssetBalanceUpdateModal
          balanceToUpdate={{
            account: balanceToUpdate.account,
            balance: balanceToUpdate.balance,
            updateDate: new Date().getTime(),
          }}
          onCancel={() => setBalanceToUpdate(undefined)}
          onComplete={() => {
            setBalanceToUpdate(undefined);
            updateNonce();
          }}
        />
      ) : null}
      <Card title={"Account Balances"} icon={"account_balance_wallet"}>
        <div className={styles.accountList}>
          {renderAccountBalanceList(accountBalances, "current", "Current Accounts")}
          {renderAccountBalanceList(accountBalances, "savings", "Savings Accounts")}
          {renderAccountBalanceList(accountBalances, "asset", "Assets")}
          {renderAccountBalanceList(accountBalances, "other", "Other")}
          <hr />
          <p className={combine(gs.bigStatValue, bs.textEnd)}>{formatCurrencyForStat(total)}</p>
        </div>
      </Card>
    </>
  );
}

export { DashboardAccountList };
