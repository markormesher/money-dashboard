import * as React from "react";
import { combine } from "../../../helpers/style-helpers";
import bs from "../../../global-styles/Bootstrap.scss";
import { MaterialIconName, MaterialIcon } from "../MaterialIcon/MaterialIcon";
import style from "./Card.scss";

type CardProps = {
  readonly title?: string;
  readonly icon?: MaterialIconName;
  readonly iconClasses?: string;
};

function Card(props: React.PropsWithChildren<CardProps>): React.ReactElement {
  const { title, icon, iconClasses, children } = props;

  return (
    <div className={combine(bs.card, style.card)}>
      {title && (
        <h5 className={combine(bs.cardHeader, style.cardHeader, bs.h5)}>
          {icon && <MaterialIcon icon={icon} className={combine(bs.me3, iconClasses)} />}
          {title}
        </h5>
      )}
      <div className={combine(bs.cardBody, style.cardBody)}>{children}</div>
    </div>
  );
}

export { Card };
