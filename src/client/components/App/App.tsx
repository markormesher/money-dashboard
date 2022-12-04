import * as React from "react";
import { ErrorInfo, PureComponent, ReactElement, ReactNode } from "react";
import ReactTooltip from "react-tooltip";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { IUser } from "../../../models/IUser";
import { DetailedError } from "../../helpers/errors/DetailedError";
import { Http404Error } from "../../helpers/errors/Http404Error";
import { IRootState } from "../../redux/root";
import { FullPageSpinner } from "../_ui/FullPageSpinner/FullPageSpinner";
import { AccountsPage } from "../AccountsPage/AccountsPage";
import { AssetPerformanceReport } from "../AssetPerformanceReport/AssetPerformanceReport";
import { BalanceHistoryReport } from "../BalanceHistoryReport/BalanceHistoryReport";
import { BudgetsPage } from "../BudgetsPage/BudgetsPage";
import { CategoriesPage } from "../CategoriesPage/CategoriesPage";
import { Dashboard } from "../Dashboard/Dashboard";
import { ErrorPage } from "../ErrorPage/ErrorPage";
import { Header } from "../Header/Header";
import { KeyShortcutModal } from "../KeyShortcutModal/KeyShortcutModal";
import { Nav } from "../Nav/Nav";
import { TaxYearDepositsReport } from "../TaxYearDepositsReport/TaxYearDepositsReport";
import { ProfilesPage } from "../ProfilesPage/ProfilesPage";
import { TransactionsPage } from "../TransactionsPage/TransactionsPage";
import { EnvelopesPage } from "../EnvelopesPage/EnvelopesPage";
import { AppContentWrapper } from "./AppContentWrapper";
import { AppRootWrapper } from "./AppRootWrapper";

interface IAppProps {
  readonly waitingFor?: string[];
  readonly globalError?: Error;
  readonly activeUser?: IUser;
  readonly currentPath?: string;
}

interface IAppState {
  readonly caughtError?: Error;
  readonly caughtErrorInfo?: ErrorInfo;
}

function mapStateToProps(state: IRootState, props: IAppProps): IAppProps {
  return {
    ...props,
    waitingFor: state.global.waitingFor,
    globalError: state.global.error,
    activeUser: state.auth.activeUser,
    currentPath: state.router.location.pathname,
  };
}

class UCApp extends PureComponent<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);
    this.state = {};
    this.render404Error = this.render404Error.bind(this);
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      caughtError: error,
      caughtErrorInfo: errorInfo,
    });
  }

  public render(): ReactNode {
    const { waitingFor, globalError, activeUser } = this.props;
    const { caughtError, caughtErrorInfo } = this.state;

    if (globalError) {
      return <ErrorPage error={globalError} fullPage={true} />;
    }

    if (caughtError) {
      return (
        <ErrorPage
          error={new DetailedError(caughtError.name, caughtError.message)}
          fullPage={true}
          stacks={[caughtError.stack, `Component stack:${caughtErrorInfo.componentStack}`]}
        />
      );
    }

    if (waitingFor.length > 0) {
      return <FullPageSpinner />;
    }

    if (!activeUser) {
      return <p>No active user.</p>;
    }

    return (
      <div>
        <Header />
        <AppRootWrapper>
          <KeyShortcutModal />
          <Nav />
          <AppContentWrapper>
            <Switch>
              <Route exact={true} path="/" component={Dashboard} />
              <Route path="/accounts" component={AccountsPage} />
              <Route path="/budgets" component={BudgetsPage} />
              <Route path="/categories" component={CategoriesPage} />
              <Route path="/envelopes" component={EnvelopesPage} />
              <Route path="/profiles" component={ProfilesPage} />
              <Route path="/transactions" component={TransactionsPage} />

              <Route path="/reports/balance-history" component={BalanceHistoryReport} />
              <Route path="/reports/asset-performance" component={AssetPerformanceReport} />
              <Route path="/reports/tax-year-deposits" component={TaxYearDepositsReport} />

              {/* Adding a new route? Keep it above this one! */}
              <Route render={this.render404Error} />
            </Switch>
          </AppContentWrapper>
        </AppRootWrapper>
        <ReactTooltip effect={"solid"} multiline={true} />
      </div>
    );
  }

  private render404Error(): ReactElement<void> {
    const { currentPath } = this.props;
    const error = new Http404Error(currentPath);
    return <ErrorPage error={error} />;
  }
}

export const App = connect(mapStateToProps)(UCApp);
