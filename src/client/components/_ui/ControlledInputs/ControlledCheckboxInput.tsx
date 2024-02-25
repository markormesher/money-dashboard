import * as React from "react";
import bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";

type ControlledCheckboxInputProps = {
  readonly id: string;
  readonly label?: string | React.ReactElement<void>;
  readonly checked: boolean;
  readonly onCheckedChange: (newValue: boolean, id: string) => void;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly inputProps?: Partial<React.InputHTMLAttributes<HTMLInputElement>>;
};

function ControlledCheckboxInput(props: ControlledCheckboxInputProps): React.ReactElement {
  const { id, label, checked, onCheckedChange, disabled, error, inputProps } = props;
  const [touched, setTouched] = React.useState(false);

  return (
    <div className={combine(bs.formCheck, bs.formCheckInline)}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        className={combine(bs.formCheckInput, touched && error && bs.isInvalid)}
        disabled={disabled !== false}
        onChange={(evt) => onCheckedChange(evt.target.checked, id)}
        onBlur={() => setTouched(true)}
        {...inputProps}
      />
      {label ? (
        <label className={combine(bs.formCheckLabel, bs.formLabel)} htmlFor={id}>
          {label}
        </label>
      ) : null}
      {error && touched && <div className={bs.invalidFeedback}>{error}</div>}
    </div>
  );
}

export { ControlledCheckboxInput };
