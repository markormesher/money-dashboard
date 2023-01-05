import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";
import { MaterialIcon } from "../MaterialIcon/MaterialIcon";

interface ILoadingSpinnerProps {
  readonly centre?: boolean;
}

class LoadingSpinner extends PureComponent<ILoadingSpinnerProps> {
  public render(): ReactNode {
    const spinner = (
      <span style={{ fontSize: "2rem" }}>
        <MaterialIcon icon={"hourglass_empty"} spin={true} />
      </span>
    );

    return <div className={combine(this.props.centre && bs.textCenter, bs.mb3)}>{spinner}</div>;
  }
}

export { LoadingSpinner };
