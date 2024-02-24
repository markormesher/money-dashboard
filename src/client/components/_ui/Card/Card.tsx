import * as React from "react";
import { combine } from "../../../helpers/style-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { MaterialIconName, MaterialIcon } from "../MaterialIcon/MaterialIcon";
import * as style from "./Card.scss";

type CardProps = {
  readonly title?: string;
  readonly icon?: MaterialIconName;
  readonly iconClasses?: string;
};

function Card(props: React.PropsWithChildren<CardProps>): React.ReactElement {
  return (
    <div className={combine(bs.card, style.card)}>
      {props.title && (
        <h5 className={combine(bs.cardHeader, style.cardHeader, bs.h5)}>
          {props.icon && <MaterialIcon icon={props.icon} className={combine(bs.me3, props.iconClasses)} />}
          {props.title}
        </h5>
      )}
      <div className={combine(bs.cardBody, style.cardBody)}>{props.children}</div>
    </div>
  );
}

export { Card };
