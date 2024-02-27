import * as React from "react";
import { ReactElement } from "react";
import ReactTooltip from "react-tooltip";
import { Route, Switch } from "react-router-dom";
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
import { EnvelopeTransfersPage } from "../EnvelopeTransfersPage/EnvelopeTransfersPage";
import { ErrorToaster } from "../ErrorToaster/ErrorToaster";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { sharedHistory } from "../../helpers/history";
import { AppContentWrapper } from "./AppContentWrapper";
import { AppRootWrapper } from "./AppRootWrapper";

type NavState = {
  isOpen: boolean;
};

const NavContext = React.createContext<{ navState: NavState; setNavState?: (state: NavState) => void }>({
  navState: { isOpen: false },
});

function App(): ReactElement {
  const [error, setError] = React.useState<Error>();
  const [errorMsg, setErrorMsg] = React.useState<string>();
  const [navState, setNavState] = React.useState({ isOpen: false });

  React.useEffect(() => {
    globalErrorManager.addFatalErrorReceiver((message, error) => {
      console.log(message, { error });
      setError(error);
      setErrorMsg(message);
    });
  }, []);

  if (error || errorMsg) {
    return <ErrorPage error={error} title={errorMsg} fullPage={true} />;
  }

  return (
    <div>
      <NavContext.Provider value={{ navState, setNavState }}>
        <Header />
      </NavContext.Provider>
      <AppRootWrapper>
        <KeyShortcutModal />
        <NavContext.Provider value={{ navState, setNavState }}>
          <Nav />
        </NavContext.Provider>
        <AppContentWrapper>
          <Switch>
            <Route exact={true} path="/" component={Dashboard} />
            <Route path="/accounts" component={AccountsPage} />
            <Route path="/budgets" component={BudgetsPage} />
            <Route path="/categories" component={CategoriesPage} />
            <Route path="/envelopes" component={EnvelopesPage} />
            <Route path="/envelope-transfers" component={EnvelopeTransfersPage} />
            <Route path="/profiles" component={ProfilesPage} />
            <Route path="/transactions" component={TransactionsPage} />

            <Route path="/reports/balance-history" component={BalanceHistoryReport} />
            <Route path="/reports/asset-performance" component={AssetPerformanceReport} />
            <Route path="/reports/tax-year-deposits" component={TaxYearDepositsReport} />

            {/* Adding a new route? Keep it above this one! */}
            <Route
              render={() => {
                return (
                  <ErrorPage
                    title={"Not Found"}
                    error={new Error(`The path "${sharedHistory.location.pathname}" does not exist.`)}
                  />
                );
              }}
            />
          </Switch>
        </AppContentWrapper>
      </AppRootWrapper>
      <ReactTooltip effect={"solid"} multiline={true} />
      <ErrorToaster />
    </div>
  );
}

export { App, NavContext };
