import { faRandom } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { formatDistanceToNow } from "date-fns";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatCurrency } from "../../helpers/formatters";
import { Card } from "../_ui/Card/Card";
import { IAccount } from "../../../models/IAccount";
import { DEFAULT_CURRENCY_CODE, CurrencyCode, getCurrency, DEFAULT_CURRENCY } from "../../../models/ICurrency";
import { combine } from "../../helpers/style-helpers";
import { ExchangeRateMap } from "../../../models/IExchangeRate";

interface IDashboardExchangeRateHistoryProps {
  readonly accounts?: IAccount[];
  readonly exchangeRates?: ExchangeRateMap;
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

    const nonDefaultCurrencyCodes = this.props.accounts
      .map((a) => a.currencyCode)
      .filter((c) => c !== DEFAULT_CURRENCY_CODE)
      .filter((c, i, a) => a.indexOf(c) === i);

    if (!nonDefaultCurrencyCodes.length) {
      return null;
    }

    return nonDefaultCurrencyCodes.map((c) => this.renderSingleHistory(c));
  }

  private renderSingleHistory(currencyCode: CurrencyCode): ReactNode {
    const exchangeRate = this.props.exchangeRates[currencyCode];
    const currency = getCurrency(currencyCode);

    const rateAge = formatDistanceToNow(exchangeRate.updateTime);

    return (
      <div key={`history-${currencyCode}`} className={combine(bs.col12, bs.colSm6)}>
        <Card title={`${DEFAULT_CURRENCY_CODE}/${currencyCode}`} icon={faRandom}>
          <p>
            <span>
              {DEFAULT_CURRENCY.htmlSymbol}
              {formatCurrency(1)}
              {" = "}
              {currency.htmlSymbol}
              {formatCurrency(exchangeRate.ratePerGbp / 1, 3)}
            </span>
            <span className={bs.floatEnd}>
              {currency.htmlSymbol}
              {formatCurrency(1)}
              {" = "}
              {DEFAULT_CURRENCY.htmlSymbol}
              {formatCurrency(1 / exchangeRate.ratePerGbp, 3)}
            </span>
          </p>
          <p className={bs.textMuted}>Updated {rateAge} ago</p>
        </Card>
      </div>
    );
  }
}

export { DashboardExchangeRateHistory };
