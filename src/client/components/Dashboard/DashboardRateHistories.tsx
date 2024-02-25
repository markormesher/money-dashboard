import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import bs from "../../global-styles/Bootstrap.scss";
import { formatCurrency, formatDate } from "../../helpers/formatters";
import { Card } from "../_ui/Card/Card";
import { DEFAULT_CURRENCY_CODE, CurrencyCode, getCurrency, DEFAULT_CURRENCY } from "../../../models/ICurrency";
import { combine } from "../../helpers/style-helpers";
import { StockTicker, getStock } from "../../../models/IStock";
import { AccountApi } from "../../api/accounts";
import { LoadingSpinner } from "../_ui/LoadingSpinner/LoadingSpinner";
import { ExchangeRateApi } from "../../api/exchange-rates";
import { StockPriceApi } from "../../api/stock-prices";

function DashboardRateHistories(): React.ReactElement | null {
  const [accountList, refreshAccountList] = AccountApi.useAccountList();
  const [exchangeRates, refreshExchangeRates] = ExchangeRateApi.useLatestExchangeRates();
  const [stockPrices, refreshStockPrices] = StockPriceApi.useLatestStockPrices();
  React.useEffect(() => {
    refreshAccountList();
    refreshExchangeRates();
    refreshStockPrices();
  }, []);

  if (!accountList || !exchangeRates || !stockPrices) {
    return <LoadingSpinner centre={true} />;
  }

  const currenciesInUse: Set<CurrencyCode> = new Set();
  const stocksInUse: Set<StockTicker> = new Set();

  accountList.forEach((a) => {
    if (a.currencyCode != DEFAULT_CURRENCY_CODE) {
      currenciesInUse.add(a.currencyCode);
    }
    if (a.stockTicker != null) {
      stocksInUse.add(a.stockTicker);
    }
  });

  function renderSingleCurrencyHistory(currencyCode: CurrencyCode): React.ReactElement | null {
    const currency = getCurrency(currencyCode);

    const exchangeRate = exchangeRates?.[currencyCode];
    if (!exchangeRate) {
      return null;
    }

    return (
      <div key={`history-${currencyCode}`} className={combine(bs.col12, bs.colSm6)}>
        <Card title={`${DEFAULT_CURRENCY_CODE}/${currencyCode}`} icon={"shuffle"}>
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
          <p className={bs.textMuted}>Updated {formatDistanceToNow(exchangeRate.updateTime)} ago</p>
        </Card>
      </div>
    );
  }

  function renderSingleStockHistory(stockTicker: StockTicker): React.ReactElement | null {
    const stock = getStock(stockTicker);
    const stockCurrency = getCurrency(stock.baseCurrency);

    const exchangeRate = exchangeRates?.[stock.baseCurrency];
    if (!exchangeRate) {
      return null;
    }

    const stockPrice = stockPrices?.[stockTicker];
    if (!stockPrice) {
      return null;
    }

    return (
      <div key={`history-${stockTicker}`} className={combine(bs.col12, bs.colSm6)}>
        <Card title={`${stockCurrency.stringSymbol}${stock.ticker}`} icon={"trending_up"}>
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
          <p className={bs.textMuted}>Close price on {formatDate(stockPrice.date, "user")}</p>
        </Card>
      </div>
    );
  }

  if (!currenciesInUse.size && !stocksInUse.size) {
    return null;
  }

  return (
    <div className={bs.row}>
      {[...currenciesInUse].sort().map((c) => renderSingleCurrencyHistory(c))}
      {[...stocksInUse].sort().map((s) => renderSingleStockHistory(s))}
    </div>
  );
}

export { DashboardRateHistories };
