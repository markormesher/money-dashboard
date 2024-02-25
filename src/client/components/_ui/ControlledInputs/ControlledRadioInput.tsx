import * as React from "react";
import bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";

type ControlledRadioInputProps = {
  readonly id: string;
  readonly name: string;
  readonly value: string;
  readonly label: string | React.ReactElement<void>;
  readonly checked: boolean;
  readonly onValueChange: (newValue: string, id: string) => void;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly inputProps?: Partial<React.InputHTMLAttributes<HTMLInputElement>>;
};

function ControlledRadioInput(props: ControlledRadioInputProps): React.ReactElement {
  const { id, name, value, label, checked, onValueChange, disabled, error, inputProps } = props;
  const [touched, setTouched] = React.useState(false);

  return (
    <div className={combine(bs.formCheck, bs.formCheckInline)}>
      <input
        id={id}
        name={name}
        value={value}
        type="radio"
        checked={checked}
        className={combine(bs.formCheckInput, touched && error && bs.isInvalid)}
        disabled={disabled === true}
        onChange={(evt) => onValueChange(evt.target.value, id)}
        onBlur={() => setTouched(true)}
        {...inputProps}
      />
      <label className={combine(bs.formCheckLabel, bs.formLabel)} htmlFor={id}>
        {label}
      </label>
      {error && touched && <div className={bs.invalidFeedback}>{error}</div>}
    </div>
  );
}

export { ControlledRadioInput };
