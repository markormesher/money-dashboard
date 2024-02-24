import * as React from "react";
import ReactTooltip from "react-tooltip";
import { combine } from "../../../helpers/style-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import * as gs from "../../../global-styles/Global.scss";
import { MaterialIcon, MaterialIconName } from "../MaterialIcon/MaterialIcon";

type InfoIconProps<Payload = unknown> = {
  readonly hoverText: string;
  readonly customIcon?: MaterialIconName;
  readonly payload?: Payload;
  readonly onClick?: (payload?: Payload) => void;
};

function InfoIcon<Payload = unknown>(props: InfoIconProps<Payload>): React.ReactElement {
  const { hoverText, customIcon, onClick, payload } = props;

  React.useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  const icon = customIcon ? customIcon : "info";
  return (
    <span data-tip={hoverText}>
      <MaterialIcon
        className={combine(bs.textMuted, onClick && gs.clickable)}
        icon={icon}
        onClick={() => onClick?.(payload)}
      />
    </span>
  );
}

export { InfoIcon };
