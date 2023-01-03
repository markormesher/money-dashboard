import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { combine } from "../../../helpers/style-helpers";
import * as style from "./MaterialIcon.scss";

type MaterialIconName = string;

interface IMaterialIconProps {
  readonly icon: MaterialIconName;
  readonly spin?: boolean;
  readonly className?: string;
  readonly onClick?: () => unknown;
}

class MaterialIcon extends PureComponent<IMaterialIconProps> {
  public render(): ReactNode {
    const { icon, spin, className, onClick } = this.props;
    return (
      <span className={combine(style.icon, spin && style.spin, className)} onClick={onClick}>
        {icon}
      </span>
    );
  }
}

export { IMaterialIconProps, MaterialIconName, MaterialIcon };
