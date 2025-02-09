import React, { ReactElement } from "react";
import "./error.css";
import { Icon, IconGroup } from "../icon/icon";

type ErrorPanelProps = {
  error?: unknown;
  noCard?: boolean;
};

function ErrorPanel(props: ErrorPanelProps): ReactElement {
  const { error, noCard } = props;
  let errorStr: string | undefined;
  if (error instanceof Error) {
    if (error.stack) {
      errorStr = error.stack;
    } else {
      errorStr = `${error.name}: ${error.message}`;
    }
  } else {
    errorStr = error?.toString();
  }

  const body = (
    <>
      <hgroup>
        <h3>
          <IconGroup>
            <Icon name={"error"} />
            <span>Error</span>
          </IconGroup>
        </h3>
        <p>Something went wrong!</p>
      </hgroup>

      <pre>{errorStr ?? "No details provided"}</pre>
    </>
  );

  if (noCard) {
    return <div className={"error-panel"}>{body}</div>;
  } else {
    return <article className={"error-panel"}>{body}</article>;
  }
}

export { ErrorPanel };
