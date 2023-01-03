import * as React from "react";
import { PureComponent, ReactNode } from "react";
import ReactTooltip from "react-tooltip";
import { combine } from "../../../helpers/style-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import * as gs from "../../../global-styles/Global.scss";
import { MaterialIcon, MaterialIconName } from "../MaterialIcon/MaterialIcon";

interface IInfoIconProps<Payload = unknown> {
  readonly hoverText: string;
  readonly customIcon?: MaterialIconName;
  readonly payload?: Payload;
  readonly onClick?: (payload?: Payload) => void;
}

class InfoIcon<Payload = unknown> extends PureComponent<IInfoIconProps<Payload>> {
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
    const icon = customIcon ? customIcon : "info";
    return (
      <span data-tip={hoverText}>
        <MaterialIcon
          className={combine(bs.textMuted, onClick && gs.clickable)}
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
