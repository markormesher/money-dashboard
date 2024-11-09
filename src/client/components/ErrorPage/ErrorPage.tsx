import * as React from "react";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { MaterialIcon } from "../_ui/MaterialIcon/MaterialIcon";

type IErrorPageProps = {
  readonly title?: string;
  readonly error?: Error;
  readonly fullPage?: boolean;
  readonly stacks?: string[];
};

function ErrorPage(props: IErrorPageProps): React.ReactElement {
  const title = props.title ?? "Something went wrong";
  const wrapperClass = props.fullPage ? combine(bs.container, bs.pt5) : undefined;

  return (
    <div className={wrapperClass}>
      <h1 className={bs.h2}>
        <MaterialIcon icon={"warning"} className={combine(bs.me2, bs.textMuted)} />
        {title}
      </h1>

      {props.error?.name && props.error.name != "Error" ? <h2 className={bs.h3}>{props.error.name}</h2> : null}

      {props.error?.message ? <p>{props.error.message}</p> : null}

      {(props.stacks ?? []).map((stack, idx) => (
        <div key={`stack-${idx}`}>
          <h3>Stack #{idx}</h3>
          <pre>{stack}</pre>
        </div>
      ))}

      <div className={combine(bs.alert, bs.alertInfo)}>
        {/* The link is intentionally implemented as <a> rather than <Link> to force reloading the page */}
        You might want to try reloading the page, or <a href="/">going back to your dashboard</a>.
      </div>
    </div>
  );
}

export { ErrorPage };
