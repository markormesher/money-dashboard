import * as React from "react";
import { IconBtn } from "../IconBtn/IconBtn";
import { MaterialIconName } from "../MaterialIcon/MaterialIcon";

type CheckboxBtnProps<Payload = unknown> = {
  readonly text?: string;
  readonly checked?: boolean;
  readonly payload?: Payload;
  readonly onChange?: (checked: boolean, payload?: Payload) => void;
  readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
  readonly iconChecked?: MaterialIconName;
  readonly iconUnchecked?: MaterialIconName;
};

function CheckboxBtn<Payload = unknown>(props: CheckboxBtnProps<Payload>): React.ReactElement {
  const { text, checked, btnProps, iconChecked, iconUnchecked, payload, onChange } = props;

  const icon = checked ? iconChecked || "check_box" : iconUnchecked || "check_box_outline_blank";

  function toggleChecked(): void {
    const newState = !checked;
    onChange?.(newState, payload);
  }

  return (
    <IconBtn
      icon={icon}
      text={text}
      btnProps={{
        ...btnProps,
        onClick: toggleChecked,
      }}
    />
  );
}

export { CheckboxBtn };
