import React, { ReactElement } from "react";
import "./style.scss";

const defaultProps = {
  size: "1rem",
} as const;

type IconProps = Partial<typeof defaultProps> & {
  name: string;
};

function Icon(props: IconProps): ReactElement {
  const fullProps = { ...defaultProps, ...props };
  return <span className={"material-icons-outlined"}>{fullProps.name}</span>;
}

function IconGroup(props: React.PropsWithChildren): ReactElement {
  return <div className={"icon-group"}>{props.children}</div>;
}

export { Icon, IconGroup };
