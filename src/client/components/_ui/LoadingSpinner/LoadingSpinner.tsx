import * as React from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";
import { MaterialIcon } from "../MaterialIcon/MaterialIcon";

type LoadingSpinnerProps = {
  readonly centre?: boolean;
};

function LoadingSpinner(props: LoadingSpinnerProps): React.ReactElement {
  const { centre } = props;

  const spinner = (
    <span style={{ fontSize: "2rem" }}>
      <MaterialIcon icon={"hourglass_empty"} spin={true} />
    </span>
  );

  return <div className={combine(centre && bs.textCenter, bs.mb3)}>{spinner}</div>;
}

export { LoadingSpinner };
