import * as React from "react";
import { combine } from "../../../helpers/style-helpers";
import style from "./MaterialIcon.scss";

type MaterialIconName = string;

type MaterialIconProps = {
  readonly icon: MaterialIconName;
  readonly spin?: boolean;
  readonly className?: string;
  readonly onClick?: () => unknown;
};

function MaterialIcon(props: MaterialIconProps): React.ReactElement {
  const { icon, spin, className, onClick } = props;

  return (
    <span className={combine(style.icon, spin && style.spin, className)} onClick={onClick}>
      {icon}
    </span>
  );
}

export { MaterialIconProps, MaterialIconName, MaterialIcon };
