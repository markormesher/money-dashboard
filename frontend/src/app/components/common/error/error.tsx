import React, { ReactElement } from "react";
import "./error.css";
import { Icon, IconGroup } from "../icon/icon";

type ErrorPanelProps = {
  error?: unknown;
};

function ErrorPanel(props: ErrorPanelProps): ReactElement {
  const { error } = props;
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

  return (
    <article className={"error-panel"}>
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
    </article>
  );
}

export { ErrorPanel };
