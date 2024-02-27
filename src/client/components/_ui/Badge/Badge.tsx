import * as React from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";

type BadgeProps = {
  readonly className?: string;
  readonly marginLeft?: boolean;
  readonly marginRight?: boolean;
};

function Badge(props: React.PropsWithChildren<BadgeProps>): React.ReactElement {
  const { className, marginRight, marginLeft } = props;
  const classes = combine(bs.badge, className || bs.bgLight, marginRight && bs.me1, marginLeft && bs.ms1);
  return <span className={classes}>{props.children}</span>;
}

export { Badge };
