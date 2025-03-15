import React, { ReactElement } from "react";
import "./dashboard.scss";
import { useRouter } from "../app/router.js";
import { concatClasses } from "../../utils/style.js";
import { HoldingBalancesTile } from "./holding-balances-tile.js";
import { WarningsTile } from "./warnings-tile.js";

function DashboardPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: [], title: "Dashboard" });
  }, []);

  return (
    <>
      <div id={"content"} className={concatClasses("overflow-auto", "dashboard")}>
        <div className={"sidebar"}>
          <WarningsTile />
          <HoldingBalancesTile />
        </div>

        <div className={"main"}>
          <article>
            <p>Main content</p>
          </article>
        </div>
      </div>
    </>
  );
}

export { DashboardPage };
