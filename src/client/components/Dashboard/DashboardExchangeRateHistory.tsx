import { faRandom } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatCurrency } from "../../helpers/formatters";
import { Card } from "../_ui/Card/Card";
import { IAccount } from "../../../commons/models/IAccount";
import { DEFAULT_CURRENCY_CODE, CurrencyCode, getCurrency, DEFAULT_CURRENCY } from "../../../commons/models/ICurrency";
import { combine } from "../../helpers/style-helpers";
import { ExchangeRateMap } from "../../../commons/models/IExchangeRate";
import { convertLocalDateToUtc } from "../../../commons/utils/dates";

interface IDashboardExchangeRateHistoryProps {
  readonly accounts?: IAccount[];
  readonly exchangeRates: ExchangeRateMap;
}

class DashboardExchangeRateHistory extends PureComponent<IDashboardExchangeRateHistoryProps> {
  constructor(props: IDashboardExchangeRateHistoryProps) {
    super(props);
    this.renderSingleHistory = this.renderSingleHistory.bind(this);
  }

  public render(): ReactNode {
    if (!this.props.accounts || !this.props.exchangeRates) {
      return null;
    }

    const allNonDefaultCurrencies = this.props.accounts
      .map((a) => a.currencyCode)
      .filter((c) => c !== DEFAULT_CURRENCY_CODE)
      .filter((c, i, a) => a.indexOf(c) === i);

    if (!allNonDefaultCurrencies.length) {
      return null;
    }

    return allNonDefaultCurrencies.map((c) => this.renderSingleHistory(c));
  }

  private renderSingleHistory(currencyCode: CurrencyCode): ReactNode {
    const exchangeRate = this.props.exchangeRates[currencyCode];
    const currency = getCurrency(currencyCode);

    const now = convertLocalDateToUtc(new Date().getTime());
    const rateAgeMs = now - exchangeRate.updateTime;

    return (
      <div key={`history-${currencyCode}`} className={combine(bs.col12, bs.colSm6)}>
        <Card title={`${currencyCode} - ${DEFAULT_CURRENCY_CODE}`} icon={faRandom}>
          <p>
            {currency.htmlSymbol}
            {formatCurrency(1)}
            {" = "}
            {DEFAULT_CURRENCY.htmlSymbol}
            {formatCurrency(1 / exchangeRate.ratePerGbp)}{" "}
            <span className={bs.textMuted}>{rateAgeMs} ago</span>
          </p>
        </Card>
      </div>
    );
  }
}

export { DashboardExchangeRateHistory };
