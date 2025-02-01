import React, { ReactElement } from "react";
import { Icon } from "../icon/icon";
import { concatClasses } from "../../utils/style";
import { useRouter } from "./router";

type MenuProps = {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
};

function Menu(props: MenuProps): ReactElement {
  const { menuOpen, setMenuOpen } = props;
  const { path: currentPath } = useRouter();

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
    </aside>
  );
}

export { Menu };
