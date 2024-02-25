import * as React from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";
import { MaterialIconName, MaterialIcon, MaterialIconProps } from "../MaterialIcon/MaterialIcon";

type IconBtnProps<Payload = unknown> = {
  readonly icon: MaterialIconName;
  readonly text?: string;
  readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
  readonly iconProps?: Partial<MaterialIconProps>;
  readonly onClick?: (payload?: Payload) => void;
  readonly payload?: Payload;
};

function IconBtn<Payload = unknown>(props: IconBtnProps<Payload>): React.ReactElement {
  const { icon, text, btnProps, iconProps, onClick, payload } = props;
  const { className: btnClassName, ...otherBtnProps } = { ...btnProps };

  return (
    <button
      className={combine(bs.btn, btnClassName)}
      onClick={() => onClick?.(payload)}
      {...otherBtnProps}
      type="button"
    >
      <MaterialIcon icon={icon} className={text ? bs.me1 : ""} {...iconProps} />
      {text}
    </button>
  );
}

export { IconBtnProps, IconBtn };
