import React from "react";
import { ReactElement } from "react";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { User, MDService, Profile } from "../../../api_gen/moneydashboard/v4/moneydashboard_pb";
import "./style.scss";
import { concatClasses } from "../../utils/style";
import { Icon, IconGroup } from "../icon/icon";
import { useRouter } from "./router";

function App(): ReactElement {
  const apiTransport = createConnectTransport({ baseUrl: "/" });
  const apiClient = createClient(MDService, apiTransport);

  const [user, setUser] = React.useState<User>();
  React.useEffect(() => {
    apiClient
      .getUser({})
      .then((res) => {
        setUser(res.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [profiles, setProfiles] = React.useState<Profile[]>();
  React.useEffect(() => {
    if (!user) {
      return;
    }

    apiClient
      .getProfiles({})
      .then((res) => {
        setProfiles(res.profiles);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  function setActiveProfile(id: string) {
    apiClient
      .setActiveProfile({ profileId: id })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [menuOpen, setMenuOpen] = React.useState(false);
  const { path } = useRouter();

  const [theme, setTheme] = React.useState("light");
  const toggleTheme = () => setTheme((curr) => (curr == "light" ? "dark" : "light"));

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
                <details className={"dropdown"}>
                  <summary>{user?.activeProfile?.name}</summary>
                  <ul dir={"rtl"}>
                    {profiles?.map((p) => (
                      <li key={p.id} onClick={() => setActiveProfile(p.id)}>
                        {p.name}
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
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
        <nav aria-label={"breadcrumb"}>
          <ul>
            <li>
              <a className={"secondary"} onClick={() => setMenuOpen(true)}>
                <Icon name={"menu"} />
              </a>
            </li>
            <li>
              <a className={"secondary"} onClick={() => setMenuOpen(true)}>
                Dashboard
              </a>
            </li>
          </ul>
        </nav>

        <aside className={concatClasses("main-menu", menuOpen && "open")}>
          <header>
            <h2>Dashboard</h2>
            <a href={"#"} aria-label={"Close"} onClick={() => setMenuOpen(false)} className={"secondary"}>
              <Icon name={"close"} />
            </a>
          </header>

          <nav>
            <details open={true}>
              <summary>Home</summary>
              <ul>
                <li className={"active"}>
                  <a href={"/"} className={"secondary"}>
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href={"/settings/currencies"} className={"secondary"}>
                    Currencies
                  </a>
                </li>
              </ul>
            </details>

            <details open={true}>
              <summary>Settings</summary>
              <ul>
                <li className={"active"}>
                  <a href={"/settings/accounts"} className={"secondary"}>
                    Accounts
                  </a>
                </li>
                <li>
                  <a href={"/settings/currencies"} className={"secondary"}>
                    Currencies
                  </a>
                </li>
              </ul>
            </details>

            <details>
              <summary>Tools</summary>
              <ul>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
              </ul>
            </details>

            <details>
              <summary>Huge Menu</summary>
              <ul>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
                <li>
                  <a href={"/"} className={"secondary"}>
                    Link
                  </a>
                </li>
              </ul>
            </details>
          </nav>
        </aside>

        <div id={"content"}>
          <section>
            <p>Path: {path}</p>
            <p>User:</p>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <p>Profiles:</p>
            <pre>{JSON.stringify(profiles, null, 2)}</pre>
          </section>
        </div>
      </main>
    </>
  );
}

export { App };
