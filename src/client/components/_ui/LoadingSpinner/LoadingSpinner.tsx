import { faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";

interface ILoadingSpinnerProps {
  readonly centre?: boolean;
}

class LoadingSpinner extends PureComponent<ILoadingSpinnerProps> {
  public render(): ReactNode {
    return (
      <div className={combine(bs.mb3, this.props.centre && bs.textCenter)}>
        <FontAwesomeIcon icon={faCircleNotch} spin={true} size={"2x"} />
      </div>
    );
  }
}

export { LoadingSpinner };
