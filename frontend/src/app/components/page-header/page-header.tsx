import React, { ReactElement } from "react";
import "./page-header.scss";
import { Icon } from "../common/icon/icon";

type PageHeaderProps = {
  title: string;
  buttons?: ReactElement[];
  options?: ReactElement;
  optionsStartOpen?: boolean;
};

function PageHeader(props: React.PropsWithChildren<PageHeaderProps>): ReactElement {
  const [showOptions, setShowOptions] = React.useState(props.optionsStartOpen ?? false);

  let buttons = props.buttons ?? [];

  if (props.options) {
    buttons = [
      ...buttons,
      <button className={"outline"} onClick={() => setShowOptions((c) => !c)}>
        <Icon name={"tune"} />
      </button>,
    ];
  }

  return (
    <>
      <section>
        <div className={"page-header"}>
          <h3>{props.title}</h3>
          {buttons ? <div role={"group"}>{buttons}</div> : null}
        </div>
      </section>

      {props.options && showOptions ? (
        <section>
          <article className={"page-options"}>{props.options}</article>
        </section>
      ) : null}
    </>
  );
}

export { PageHeader };
