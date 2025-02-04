import React, { ReactElement } from "react";
import { Icon, IconGroup } from "../icon/icon";
import { concatClasses } from "../../utils/style";
import { Profile, User } from "../../../api_gen/moneydashboard/v4/moneydashboard_pb";
import { apiClient } from "../../../api/api";
import { ProfileChooser } from "../profile-chooser/profile-chooser";
import { useRouter } from "./router";

type MenuProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

function Menu(props: MenuProps): ReactElement {
  const { menuOpen, setMenuOpen } = props;
  const { path: currentPath } = useRouter();

  const [profileChooserOpen, setProfileChooserOpen] = React.useState(false);

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

  React.useEffect(() => {
    document.querySelectorAll("nav > details").forEach((d) => {
      if (d.querySelector("li.active")) {
        d.setAttribute("open", "open");
      } else {
        d.removeAttribute("open");
      }
    });
  }, [currentPath]);

  function link(path: string, text: string): ReactElement {
    return (
      <li className={concatClasses(path == currentPath && "active")}>
        <a href={path} onClick={() => props.setMenuOpen(false)} className={"secondary"}>
          {text}
        </a>
      </li>
    );
  }

  return (
    <>
      <aside className={concatClasses("main-menu", menuOpen && "open")}>
        <header>
          <a href={"#"} aria-label={"Close"} onClick={() => setMenuOpen(false)} className={"secondary"}>
            <Icon name={"close"} />
          </a>
        </header>

        <nav>
          <ul>
            {link("/", "Dashboard")}
            {link("/transactions", "Transactions")}
          </ul>

          <details>
            <summary>Reports</summary>
            <ul>
              {link("/reports/balance-history", "Balance History")}
              {link("/reports/tax-helper", "Tax Helper")}
            </ul>
          </details>

          <details>
            <summary>Settings</summary>
            <ul>
              {link("/accounts", "Accounts")}
              {link("/assets", "Assets")}
              {link("/budgets", "Budgets")}
              {link("/categories", "Categories")}
              {link("/currencies", "Currencies")}
              {link("/envelopes", "Envelopes")}
              {link("/holdings", "Holdings")}
              {link("/profiles", "Profiles")}
            </ul>
          </details>
        </nav>

        <div className={"profile-switcher-link"}>
          <IconGroup>
            <Icon name={"shuffle"} />
            <a href={"#"} className={"secondary"} onClick={() => setProfileChooserOpen(true)}>
              Profile: {user?.activeProfile?.name}
            </a>
          </IconGroup>
        </div>
      </aside>

      <ProfileChooser open={profileChooserOpen} setOpen={setProfileChooserOpen} />
    </>
  );
}

export { Menu };
