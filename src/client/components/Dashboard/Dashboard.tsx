import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IAccountBalance } from "../../../models/IAccountBalance";
import { IBudgetBalance } from "../../../models/IBudgetBalance";
import { ICategoryBalance } from "../../../models/ICategoryBalance";
import { IUser } from "../../../models/IUser";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import {
  startLoadAccountBalances,
  startLoadBudgetBalances,
  startLoadMemoCategoryBalances,
} from "../../redux/dashboard";
import { IRootState } from "../../redux/root";
import { ExchangeRateMap } from "../../../models/IExchangeRate";
import { startLoadLatestExchangeRates } from "../../redux/exchange-rates";
import { startLoadLatestStockPrices } from "../../redux/stock-prices";
import { startLoadAccountList } from "../../redux/accounts";
import { IAccount } from "../../../models/IAccount";
import { StockPriceMap } from "../../../models/IStockPrice";
import { DashboardAccountList } from "./DashboardAccountList";
import { DashboardAlertList } from "./DashboardAlertList";
import { DashboardBudgetList } from "./DashboardBudgetList";
import { DashboardRateHistories } from "./DashboardRateHistories";
import { DashboardAssetBalanceUpdateModal } from "./DashboardAssetBalanceUpdateModal";
import { DashboardEnvelopeList } from "./DashboardEnvelopeList";

interface IDashboardProps {
  readonly activeUser: IUser;
  readonly accountList?: IAccount[];
  readonly accountBalances?: IAccountBalance[];
  readonly assetBalanceToUpdate?: IAccountBalance;
  readonly budgetBalances?: IBudgetBalance[];
  readonly memoCategoryBalances?: ICategoryBalance[];
  readonly exchangeRates: ExchangeRateMap;
  readonly stockPrices: StockPriceMap;

  readonly actions?: {
    readonly startLoadAccountList: () => AnyAction;
    readonly startLoadAccountBalances: () => AnyAction;
    readonly startLoadBudgetBalances: () => AnyAction;
    readonly startLoadMemoCategoryBalances: () => AnyAction;
    readonly startLoadLatestExchangeRates: () => AnyAction;
    readonly startLoadLatestStockPrices: () => AnyAction;
  };
}

function mapStateToProps(state: IRootState, props: IDashboardProps): IDashboardProps {
  return {
    ...props,
    activeUser: state.auth.activeUser,
    accountList: state.accounts.accountList,
    accountBalances: state.dashboard.accountBalances,
    assetBalanceToUpdate: state.dashboard.assetBalanceToUpdate,
    budgetBalances: state.dashboard.budgetBalances,
    memoCategoryBalances: state.dashboard.memoCategoryBalances,
    exchangeRates: state.exchangeRates.latestExchangeRates,
    stockPrices: state.stockPrices.latestStockPrices,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IDashboardProps): IDashboardProps {
  return {
    ...props,
    actions: {
      startLoadAccountList: (): AnyAction => dispatch(startLoadAccountList()),
      startLoadAccountBalances: (): AnyAction => dispatch(startLoadAccountBalances()),
      startLoadBudgetBalances: (): AnyAction => dispatch(startLoadBudgetBalances()),
      startLoadMemoCategoryBalances: (): AnyAction => dispatch(startLoadMemoCategoryBalances()),
      startLoadLatestExchangeRates: (): AnyAction => dispatch(startLoadLatestExchangeRates()),
      startLoadLatestStockPrices: (): AnyAction => dispatch(startLoadLatestStockPrices()),
    },
  };
}

class UCDashboard extends PureComponent<IDashboardProps> {
  public componentDidMount(): void {
    this.props.actions.startLoadAccountList();
    this.props.actions.startLoadAccountBalances();
    this.props.actions.startLoadBudgetBalances();
    this.props.actions.startLoadMemoCategoryBalances();
    this.props.actions.startLoadLatestExchangeRates();
    this.props.actions.startLoadLatestStockPrices();
  }

  public componentDidUpdate(): void {
    this.props.actions.startLoadAccountList();
    this.props.actions.startLoadAccountBalances();
    this.props.actions.startLoadBudgetBalances();
    this.props.actions.startLoadMemoCategoryBalances();
  }

  public render(): ReactNode {
    const { assetBalanceToUpdate } = this.props;
    return (
      <>
        {assetBalanceToUpdate !== undefined && <DashboardAssetBalanceUpdateModal />}
        <div className={bs.row}>
          <div className={combine(bs.colSm12, bs.colMd8)}>
            <DashboardEnvelopeList />
            <DashboardBudgetList budgetBalances={this.props.budgetBalances} />
            <div className={bs.row}>
              <DashboardRateHistories
                accounts={this.props.accountList}
                exchangeRates={this.props.exchangeRates}
                stockPrices={this.props.stockPrices}
              />
            </div>
          </div>
          <div className={combine(bs.colSm12, bs.colMd4)}>
            <DashboardAlertList memoCategoryBalances={this.props.memoCategoryBalances} />
            <DashboardAccountList
              accountBalances={this.props.accountBalances}
              exchangeRates={this.props.exchangeRates}
              stockPrices={this.props.stockPrices}
            />
          </div>
        </div>
      </>
    );
  }
}

export const Dashboard = connect(mapStateToProps, mapDispatchToProps)(UCDashboard);
