import * as React from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";

type ControlledTextAreaProps = {
  readonly id: string;
  readonly label: string | React.ReactElement<void>;
  readonly placeholder?: string;
  readonly value: string | number;
  readonly onValueChange: (newValue: string, id: string) => void;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly inputProps?: Partial<React.InputHTMLAttributes<HTMLTextAreaElement>>;
};

function ControlledTextArea(props: ControlledTextAreaProps): React.ReactElement {
  const { id, label, placeholder, value, onValueChange, disabled, error, inputProps } = props;
  const [touched, setTouched] = React.useState(false);

  return (
    <>
      <label htmlFor={id} className={bs.formLabel}>
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        onChange={(evt) => onValueChange(evt.target.value, id)}
        disabled={disabled !== false}
        className={combine(bs.formControl, touched && error && bs.isInvalid)}
        placeholder={placeholder || ""}
        value={value || ""}
        onBlur={() => setTouched(true)}
        {...inputProps}
      />
      {error && touched && <div className={bs.invalidFeedback}>{error}</div>}
    </>
  );
}

export { ControlledTextArea };
