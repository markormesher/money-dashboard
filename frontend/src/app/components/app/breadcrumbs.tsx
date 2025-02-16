import React, { ReactElement } from "react";
import { Icon } from "../common/icon/icon.js";
import { useRouter } from "./router.js";

type BreadcrumbProps = {
  setMenuOpen: (open: boolean) => void;
};

function Breadcrumbs(props: BreadcrumbProps): ReactElement {
  const { setMenuOpen } = props;
  const { meta } = useRouter();

  return (
    <nav aria-label={"breadcrumb"}>
      <ul>
        <li>
          <a className={"secondary"} onClick={() => setMenuOpen(true)}>
            <Icon name={"menu"} />
          </a>
        </li>
        {meta.parents?.map((p) => (
          <li>
            <a className={"secondary"} onClick={() => setMenuOpen(true)}>
              {p}
            </a>
          </li>
        ))}
        <li>
          <a className={"secondary"} onClick={() => setMenuOpen(true)}>
            {meta.title}
          </a>
        </li>
      </ul>
    </nav>
  );
}

export { Breadcrumbs };
