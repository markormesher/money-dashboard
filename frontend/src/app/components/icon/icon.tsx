import React, { ReactElement } from "react";

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

export { Icon };
