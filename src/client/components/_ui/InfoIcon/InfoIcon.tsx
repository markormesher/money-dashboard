import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import ReactTooltip from "react-tooltip";
import * as bs from "../../../global-styles/Bootstrap.scss";

interface IInfoIconPros {
  readonly hoverText: string;
}

class InfoIcon extends PureComponent<IInfoIconPros> {
  public componentDidMount(): void {
    ReactTooltip.rebuild();
  }

  public render(): ReactNode {
    const { hoverText } = this.props;
    return (
      <span data-tip={hoverText}>
        <FontAwesomeIcon className={bs.textMuted} fixedWidth={true} icon={faInfoCircle} />
      </span>
    );
  }
}

export { InfoIcon };
