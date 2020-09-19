import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import ReactTooltip from "react-tooltip";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import * as bs from "../../../global-styles/Bootstrap.scss";

interface IInfoIconPros {
  readonly hoverText: string;
  readonly customIcon?: IconProp;
}

class InfoIcon extends PureComponent<IInfoIconPros> {
  public componentDidMount(): void {
    ReactTooltip.rebuild();
  }

  /* istanbul ignore next - hard to reproduce this in tests */
  public componentDidUpdate(): void {
    ReactTooltip.rebuild();
  }

  public render(): ReactNode {
    const { hoverText, customIcon } = this.props;
    const icon = customIcon ? customIcon : faInfoCircle;
    return (
      <span data-tip={hoverText}>
        <FontAwesomeIcon className={bs.textMuted} fixedWidth={true} icon={icon} />
      </span>
    );
  }
}

export { InfoIcon };
