import { PureComponent, ReactNode } from "react";
import * as React from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { combine } from "../../../helpers/style-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import * as gs from "../../../global-styles/Global.scss";

interface ICardProps {
  readonly title?: string;
  readonly icon?: IconProp;
}

class Card extends PureComponent<ICardProps> {
  public render(): ReactNode {
    const { title, icon, children } = this.props;
    return (
      <div className={bs.card}>
        {title && (
          <h5 className={combine(bs.cardHeader, bs.h5)}>
            {icon && <FontAwesomeIcon icon={icon} className={bs.mr3} />}
            {title}
          </h5>
        )}
        <div className={combine(bs.cardBody, gs.cardBody)}>{children}</div>
      </div>
    );
  }
}

export { Card };
