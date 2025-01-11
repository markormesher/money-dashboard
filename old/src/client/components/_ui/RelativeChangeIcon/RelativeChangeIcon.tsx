import * as React from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";
import { MaterialIconProps, MaterialIcon, MaterialIconName } from "../MaterialIcon/MaterialIcon";

type RelativeChangeIconProps = {
  readonly change: number;
  readonly iconProps?: Partial<MaterialIconProps>;
};

function RelativeChangeIcon(props: RelativeChangeIconProps): React.ReactElement | null {
  const { change, iconProps } = props;
  const { className: iconClassName, ...otherIconProps } = { ...iconProps };

  if (change === 0) {
    return null;
  }

  let changeIcon: MaterialIconName = "";
  let changeClass = "";
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

export { RelativeChangeIcon };
