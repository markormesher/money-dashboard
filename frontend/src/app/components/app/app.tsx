import React from "react";
import { ReactElement } from "react";
import "./style.scss";
import { Icon, IconGroup } from "../icon/icon";
import { useRouter } from "./router";
import { Menu } from "./menu";
import { Breadcrumbs } from "./breadcrumbs";

function App(): ReactElement {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { path, setMeta } = useRouter();

  const [theme, setTheme] = React.useState("light");
  const toggleTheme = () => setTheme((curr) => (curr == "light" ? "dark" : "light"));

  // TODO: move into real pages later
  React.useEffect(() => setMeta({ title: "Dashboard" }), []);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <header id={"main-header"}>
        <div className={"container-fluid"}>
          <div>
            <IconGroup>
              <a href={"/"}>
                <Icon name={"account_balance"} />
              </a>
              <a href={"/"}>Money Dashboard</a>
            </IconGroup>
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

      <main className={"container-fluid"}>
        <Breadcrumbs setMenuOpen={setMenuOpen} />

        <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <div id={"content"}>
          <section>
            <p>Path: {path}</p>
          </section>
        </div>
      </main>
    </>
  );
}

export { App };
