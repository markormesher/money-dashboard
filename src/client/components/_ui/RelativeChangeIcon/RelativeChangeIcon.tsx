import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";
import { IMaterialIconProps, MaterialIcon, MaterialIconName } from "../MaterialIcon/MaterialIcon";

interface IRelativeChangeIconProps {
  readonly change: number;
  readonly iconProps?: Partial<IMaterialIconProps>;
}

class RelativeChangeIcon extends PureComponent<IRelativeChangeIconProps> {
  public render(): ReactNode {
    const { change, iconProps } = this.props;
    const { className: iconClassName, ...otherIconProps } = { ...iconProps };

    if (change === 0) {
      return null;
    }

    let changeIcon: MaterialIconName;
    let changeClass: string;
    if (change < 0) {
      changeIcon = "trending_down";
      changeClass = bs.textDanger;
    }
    if (change > 0) {
      changeIcon = "trending_up";
      changeClass = bs.textSuccess;
    }

    return <MaterialIcon icon={changeIcon} className={combine(changeClass, iconClassName)} {...otherIconProps} />;
  }
}

export { RelativeChangeIcon };
