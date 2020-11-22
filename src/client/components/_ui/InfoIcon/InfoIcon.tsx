import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import ReactTooltip from "react-tooltip";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { combine } from "../../../helpers/style-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import * as gs from "../../../global-styles/Global.scss";

interface IInfoIconProps<Payload> {
  readonly hoverText: string;
  readonly customIcon?: IconProp;
  readonly payload?: Payload;
  readonly onClick?: (payload?: Payload) => void;
}

class InfoIcon<Payload = {}> extends PureComponent<IInfoIconProps<Payload>> {
  constructor(props: IInfoIconProps<Payload>) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  public componentDidMount(): void {
    ReactTooltip.rebuild();
  }

  /* istanbul ignore next - hard to reproduce this in tests */
  public componentDidUpdate(): void {
    ReactTooltip.rebuild();
  }

  public render(): ReactNode {
    const { hoverText, customIcon, onClick } = this.props;
    const icon = customIcon ? customIcon : faInfoCircle;
    return (
      <span data-tip={hoverText}>
        <FontAwesomeIcon
          className={combine(bs.textMuted, onClick && gs.clickable)}
          fixedWidth={true}
          icon={icon}
          onClick={this.handleClick}
        />
      </span>
    );
  }

  private handleClick(): void {
    const { onClick, payload } = this.props;
    if (onClick) {
      if (payload) {
        onClick(payload);
      } else {
        onClick();
      }
    }
  }
}

export { InfoIcon };
