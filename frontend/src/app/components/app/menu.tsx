import React, { ReactElement } from "react";
import { Icon, IconGroup } from "../common/icon/icon";
import { concatClasses } from "../../utils/style";
import { userServiceClient } from "../../../api/api";
import { ProfileChooser } from "../profile-chooser/profile-chooser";
import { useAsyncEffect } from "../../utils/hooks";
import { toastBus } from "../toaster/toaster";
import { User } from "../../../api_gen/moneydashboard/v4/users_pb";
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
  useAsyncEffect(async () => {
    try {
      const res = await userServiceClient.getUser({});
      setUser(res.user);
    } catch (e) {
      toastBus.error("Failed to load user");
      console.log(e);
    }
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
          <ul>{link("/", "Dashboard")}</ul>

          <details>
            <summary>Records</summary>
            <ul>
              {link("/records/accounts", "Accounts")}
              {link("/records/categories", "Categories")}
              {link("/records/holdings", "Holdings")}
              {link("/records/transactions", "Transactions")}
            </ul>
          </details>

          <details>
            <summary>Planning</summary>
            <ul>
              {link("/planning/budgets", "Budgets")}
              {link("/planning/envelopes", "Envelopes")}
            </ul>
          </details>

          <details>
            <summary>Reports</summary>
            <ul>
              {link("/reports/balance-history", "Balance History")}
              {link("/reports/tax-helper", "Tax Helper")}
            </ul>
          </details>

          <details>
            <summary>Metadata</summary>
            <ul>
              {link("/metadata/assets", "Assets")}
              {link("/metadata/currencies", "Currencies")}
              {link("/metadata/profiles", "Profiles")}
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

      <ProfileChooser open={profileChooserOpen} onClose={() => setProfileChooserOpen(false)} />
    </>
  );
}

export { Menu };
