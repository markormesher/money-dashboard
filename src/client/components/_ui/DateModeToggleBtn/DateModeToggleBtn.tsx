import * as React from "react";
import { DateModeOption } from "../../../../models/ITransaction";
import { capitaliseFirstLetter } from "../../../helpers/formatters";
import { IconBtn } from "../IconBtn/IconBtn";

type DateModeToggleBtnProps = {
  readonly value?: DateModeOption;
  readonly onChange?: (value: DateModeOption) => void;
  readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
};

function DateModeToggleBtn(props: DateModeToggleBtnProps): React.ReactElement {
  const { value, onChange, btnProps } = props;

  function toggleValue(): void {
    const newValue = value === "effective" ? "transaction" : "effective";
    if (onChange) {
      onChange(newValue);
    }
  }

  const text = `Date Mode: ${capitaliseFirstLetter(value)} Date`;
  return (
    <IconBtn
      icon={"today"}
      text={text}
      btnProps={{
        ...btnProps,
        onClick: toggleValue,
      }}
    />
  );
}

export { DateModeToggleBtn };
