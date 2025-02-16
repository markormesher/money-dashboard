import React, { ReactElement } from "react";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { concatClasses } from "../../utils/style.js";
import { userServiceClient } from "../../../api/api.js";
import { ProfileChooser } from "../profile-chooser/profile-chooser.js";
import { useAsyncEffect, useKeyShortcut } from "../../utils/hooks.js";
import { toastBus } from "../toaster/toaster.js";
import { User } from "../../../api_gen/moneydashboard/v4/users_pb.js";
import { useRouter } from "./router.js";

type MenuProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

function Menu(props: MenuProps): ReactElement {
  const { menuOpen, setMenuOpen } = props;
  const { navigate, path: currentPath } = useRouter();

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

  useKeyShortcut({
    targetStr: "gd",
    onTrigger: () => {
      setMenuOpen(false);
      navigate("/");
    },
  });
  useKeyShortcut({
    targetStr: "gt",
    onTrigger: () => {
      setMenuOpen(false);
      navigate("/records/transactions");
    },
  });

  function link(path: string, text: string, icon: string): ReactElement {
    return (
      <li className={concatClasses(path == currentPath && "active")} key={path}>
        <IconGroup>
          <Icon name={icon} />
          <a href={path} onClick={() => props.setMenuOpen(false)}>
            {text}
          </a>
        </IconGroup>
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
            {link("/", "Dashboard", "house")}
            {link("/transactions", "Transactions", "list")}
          </ul>

          <details>
            <summary>Reports</summary>
            <ul>
              {link("/reports/balance-history", "Balance History", "monitoring")}
              {link("/reports/tax-helper", "Tax Helper", "receipt_long")}
            </ul>
          </details>

          <details>
            <summary>Planning</summary>
            <ul>
              {link("/planning/budgets", "Budgets", "tune")}
              {link("/planning/envelopes", "Envelopes", "mail")}
            </ul>
          </details>

          <details>
            <summary>Settings</summary>
            <ul>
              {link("/settings/accounts", "Accounts", "account_balance")}
              {link("/settings/categories", "Categories", "label")}
              {link("/settings/holdings", "Holdings", "account_balance_wallet")}
            </ul>
          </details>

          <details>
            <summary>Metadata</summary>
            <ul>
              {link("/metadata/assets", "Assets", "candlestick_chart")}
              {link("/metadata/currencies", "Currencies", "payments")}
              {link("/metadata/profiles", "Profiles", "group")}
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
