import React from "react";
import { ReactElement } from "react";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { User, MDService, Profile } from "../../../api_gen/moneydashboard/v4/moneydashboard_pb";
import "./style.scss";
import { Icon, IconGroup } from "../icon/icon";
import { useRouter } from "./router";
import { Menu } from "./menu";
import { Breadcrumbs } from "./breadcrumbs";

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
  const { path, setMeta } = useRouter();

  const [theme, setTheme] = React.useState("light");
  const toggleTheme = () => setTheme((curr) => (curr == "light" ? "dark" : "light"));

  // TODO: move into real pages later
  React.useEffect(() => setMeta?.({ title: "Dashboard" }), []);

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
        <Breadcrumbs setMenuOpen={setMenuOpen} />

        <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <div id={"content"}>
          <section>
            <p>Path: {path}</p>
            <p>User: {user?.displayName ?? "Loading..."}</p>
            <p>
              Profile:{" "}
              {profiles
                ?.map((p) => p.name)
                ?.sort()
                ?.join(", ") ?? "Loading..."}
            </p>
          </section>
        </div>
      </main>
    </>
  );
}

export { App };
