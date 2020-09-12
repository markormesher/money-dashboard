import { PureComponent, ReactNode } from "react";
import * as React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { combine } from "../../../helpers/style-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import * as style from "./Card.scss";

interface ICardProps {
  readonly title?: string;
  readonly icon?: IconProp;
  readonly iconClasses?: string;
}

class Card extends PureComponent<ICardProps> {
  public render(): ReactNode {
    const { title, icon, iconClasses, children } = this.props;
    return (
      <div className={combine(bs.card, style.card)}>
        {title && (
          <h5 className={combine(bs.cardHeader, style.cardHeader, bs.h5)}>
            {icon && <FontAwesomeIcon icon={icon} className={combine(bs.mr3, iconClasses)} />}
            {title}
          </h5>
        )}
        <div className={combine(bs.cardBody, style.cardBody)}>{children}</div>
      </div>
    );
  }
}

export { Card };
