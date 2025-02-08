import React, { ReactElement } from "react";
import "./page-header.scss";

type PageHeaderProps = {
  title: string;
};

function PageHeader(props: React.PropsWithChildren<PageHeaderProps>): ReactElement {
  return (
    <div className={"page-header"}>
      <h3>{props.title}</h3>
      {props.children}
    </div>
  );
}

export { PageHeader };
