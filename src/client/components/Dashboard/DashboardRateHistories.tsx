import { faRandom, faChartLine } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { formatDistanceToNow } from "date-fns";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatCurrency, formatDate } from "../../helpers/formatters";
import { Card } from "../_ui/Card/Card";
import { IAccount } from "../../../models/IAccount";
import { DEFAULT_CURRENCY_CODE, CurrencyCode, getCurrency, DEFAULT_CURRENCY } from "../../../models/ICurrency";
import { combine } from "../../helpers/style-helpers";
import { ExchangeRateMap } from "../../../models/IExchangeRate";
import { StockPriceMap } from "../../../models/IStockPrice";
import { StockTicker, getStock } from "../../../models/IStock";

interface IDashboardRateHistoriesProps {
  readonly accounts?: IAccount[];
  readonly exchangeRates?: ExchangeRateMap;
  readonly stockPrices?: StockPriceMap;
}

class DashboardRateHistories extends PureComponent<IDashboardRateHistoriesProps> {
  constructor(props: IDashboardRateHistoriesProps) {
    super(props);
    this.renderSingleCurrencyHistory = this.renderSingleCurrencyHistory.bind(this);
  }

  public render(): ReactNode {
    if (!this.props.accounts || !this.props.exchangeRates || !this.props.stockPrices) {
      return null;
    }

    const currenciesInUse = this.props.accounts
      .map((a) => a.currencyCode)
      .filter((c) => c !== DEFAULT_CURRENCY_CODE)
      .filter((c, i, a) => a.indexOf(c) === i);

    const stocksInUse = this.props.accounts
      .map((a) => a.stockTicker)
      .filter((t) => t !== null)
      .filter((t, i, a) => a.indexOf(t) === i);

    if (!currenciesInUse.length && !stocksInUse.length) {
      return null;
    }

    return (
      <>
        {currenciesInUse.map((c) => this.renderSingleCurrencyHistory(c))}
        {stocksInUse.map((s) => this.renderSingleStockHistory(s))}
      </>
    );
  }

  private renderSingleCurrencyHistory(currencyCode: CurrencyCode): ReactNode {
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
              {formatCurrency(exchangeRate.ratePerGbp / 1)}
            </span>
            <span className={bs.floatEnd}>
              {currency.htmlSymbol}
              {formatCurrency(1)}
              {" = "}
              {DEFAULT_CURRENCY.htmlSymbol}
              {formatCurrency(1 / exchangeRate.ratePerGbp)}
            </span>
          </p>
          <p className={bs.textMuted}>Updated {rateAge} ago</p>
        </Card>
      </div>
    );
  }

  private renderSingleStockHistory(stockTicker: StockTicker): ReactNode {
    const stock = getStock(stockTicker);
    const stockPrice = this.props.stockPrices[stockTicker];
    const stockCurrency = getCurrency(stock.baseCurrency);
    const exchangeRate = this.props.exchangeRates[stock.baseCurrency];

    const rateDate = formatDate(stockPrice.date, "user");

    return (
      <div key={`history-${stockTicker}`} className={combine(bs.col12, bs.colSm6)}>
        <Card title={`${stockCurrency.stringSymbol}${stock.ticker}`} icon={faChartLine}>
          <p>
            <span>
              {stockCurrency.htmlSymbol}
              {formatCurrency(stockPrice.ratePerBaseCurrency)}
            </span>
            {stock.baseCurrency !== DEFAULT_CURRENCY_CODE && (
              <span className={bs.floatEnd}>
                {"= "}
                {DEFAULT_CURRENCY.htmlSymbol}
                {formatCurrency(stockPrice.ratePerBaseCurrency / exchangeRate.ratePerGbp)}
              </span>
            )}
          </p>
          <p className={bs.textMuted}>Close price on {rateDate}</p>
        </Card>
      </div>
    );
  }
}

export { DashboardRateHistories };
