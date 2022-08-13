import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";
import { MaterialIconName, MaterialIcon, IMaterialIconProps } from "../MaterialIcon/MaterialIcon";

interface IIconBtnProps<Payload = {}> {
  readonly icon: MaterialIconName;
  readonly text?: string;
  readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
  readonly iconProps?: Partial<IMaterialIconProps>;
  readonly onClick?: (payload?: Payload) => void;
  readonly payload?: Payload;
}

class IconBtn<Payload = {}> extends PureComponent<IIconBtnProps<Payload>> {
  constructor(props: IIconBtnProps<Payload>) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  public render(): ReactNode {
    const { icon, text, btnProps, iconProps } = this.props;
    const { className: btnClassName, ...otherBtnProps } = { ...btnProps };
    return (
      <button className={combine(bs.btn, btnClassName)} onClick={this.handleClick} {...otherBtnProps} type="button">
        <MaterialIcon icon={icon} className={!!text && bs.me1} {...iconProps} />
        {text}
      </button>
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

export { IIconBtnProps, IconBtn };
