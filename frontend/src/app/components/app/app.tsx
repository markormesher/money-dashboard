import React from "react";
import { ReactElement } from "react";
import { Icon, IconGroup } from "../common/icon/icon";
import { CurrenciesPage } from "../currencies/currencies-page";
import { AssetsPage } from "../assets/assets-page";
import { CategoriesPage } from "../categories/categories-page";
import { AccountsPage } from "../accounts/accounts-page";
import { useRouter } from "./router";
import { Menu } from "./menu";
import { Breadcrumbs } from "./breadcrumbs";

import "./style/00-pico.scss";
import "./style/01-common.css";
import "./style/02-app-components.scss";

function App(): ReactElement {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { path } = useRouter();

  const [theme, setTheme] = React.useState("light");
  const toggleTheme = () => setTheme((curr) => (curr == "light" ? "dark" : "light"));

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function getContent(): ReactElement {
    switch (path) {
      case "/records/accounts":
        return <AccountsPage />;
      case "/records/categories":
        return <CategoriesPage />;

      case "/metadata/assets":
        return <AssetsPage />;
      case "/metadata/currencies":
        return <CurrenciesPage />;
    }

    return (
      <section>
        <p>Path: {path}</p>
      </section>
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
                  <Icon name={"brightness_medium"} />
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
    </>
  );
}

export { App };
