import React from "react";
import { ReactElement } from "react";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { CurrenciesPage } from "../currencies/currencies-page.js";
import { AssetsPage } from "../assets/assets-page.js";
import { CategoriesPage } from "../categories/categories-page.js";
import { AccountsPage } from "../accounts/accounts-page.js";
import { HoldingsPage } from "../holdings/holdings-page.js";
import { TransactionsPage } from "../transactions/transactions-page.js";
import { ErrorPanel } from "../common/error/error.js";
import { KeyListener } from "../common/key-shortcuts/key-shortcuts.js";
import { ProfilesPage } from "../profiles/profiles-page.js";
import { DashboardPage } from "../dashboard/dashboard.js";
import { EnvelopesPage } from "../envelopes/envelopes-page.js";
import { EnvelopeTransfersPage } from "../envelope-transfers/envelope-transfers-page.js";
import { BalanceHistoryPage } from "../reports/balance-history.js";
import { TaxHelperPage } from "../reports/tax-helper.js";
import { PortfolioSummaryPage } from "../reports/portfolio-summary.js";
import { setPrefValue, usePrefValue } from "../../utils/prefs.js";
import { useRouter } from "./router.js";
import { Menu } from "./menu.js";
import { Breadcrumbs } from "./breadcrumbs.js";
import "./style/00-pico.css";
import "./style/01-common.css";
import "./style/02-app-components.scss";

function App(): ReactElement {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { path } = useRouter();

  const theme = usePrefValue("theme");

  React.useEffect(() => {
    switch (theme) {
      case "auto":
        document.documentElement.dataset["theme"] = "";
        break;

      case "light":
        document.documentElement.dataset["theme"] = "light";
        break;

      case "dark":
        document.documentElement.dataset["theme"] = "dark";
        break;
    }
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    // auto -> dark -> light -> repeat
    if (theme == "dark") {
      setPrefValue("theme", "light");
    } else if (theme == "light") {
      setPrefValue("theme", "auto");
    } else {
      setPrefValue("theme", "dark");
    }
  }, [theme]);

  function getContent(): ReactElement {
    switch (path) {
      case "/":
        return <DashboardPage />;
      case "/transactions":
        return <TransactionsPage />;

      case "/planning/envelopes":
        return <EnvelopesPage />;
      case "/planning/envelope-transfers":
        return <EnvelopeTransfersPage />;

      case "/reports/balance-history":
        return <BalanceHistoryPage />;
      case "/reports/portfolio-summary":
        return <PortfolioSummaryPage />;
      case "/reports/tax-helper":
        return <TaxHelperPage />;

      case "/settings/accounts":
        return <AccountsPage />;
      case "/settings/categories":
        return <CategoriesPage />;
      case "/settings/holdings":
        return <HoldingsPage />;

      case "/metadata/assets":
        return <AssetsPage />;
      case "/metadata/currencies":
        return <CurrenciesPage />;
      case "/metadata/profiles":
        return <ProfilesPage />;
    }

    return (
      <div id={"content"} className={"overflow-auto"}>
        <section>
          <ErrorPanel error={`Page not found: ${path}`} />
        </section>
      </div>
    );
  }

  return (
    <>
      <header id={"main-header"}>
        <div className={"container-fluid"}>
          <div>
            <a href={"/"}>
              <IconGroup>
                <Icon name={"account_balance"} />
                <span>Money Dashboard</span>
              </IconGroup>
            </a>
          </div>
          <nav>
            <ul>
              <li>
                <a href={"#"} onClick={toggleTheme} className={"secondary"} style={{ opacity: 0.7 }}>
                  <Icon name={theme == "dark" ? "dark_mode" : theme == "light" ? "light_mode" : "brightness_auto"} />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <Breadcrumbs setMenuOpen={setMenuOpen} />
        <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        {getContent()}
      </main>

      <KeyListener />
    </>
  );
}

export { App };
