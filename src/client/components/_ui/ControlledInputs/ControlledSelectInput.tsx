import * as React from "react";
import bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";

type ControlledSelectInputProps = {
  readonly id: string;
  readonly label: string | React.ReactElement<void>;
  readonly value: string;
  readonly onValueChange: (newValue: string, id: string) => void;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly selectProps?: Partial<React.SelectHTMLAttributes<HTMLSelectElement>>;
};

function ControlledSelectInput(props: React.PropsWithChildren<ControlledSelectInputProps>): React.ReactElement {
  const { id, label, value, onValueChange, disabled, error, selectProps } = props;
  const [touched, setTouched] = React.useState(false);

  return (
    <>
      <label htmlFor={id} className={bs.formLabel}>
        {label}
      </label>
      <select
        id={id}
        name={id}
        onChange={(evt) => onValueChange(evt.target.value, id)}
        disabled={disabled !== false}
        className={combine(bs.formControl, touched && error && bs.isInvalid)}
        value={value}
        onBlur={() => setTouched(true)}
        {...selectProps}
      >
        {props.children}
      </select>
      {error && touched && <div className={bs.invalidFeedback}>{error}</div>}
    </>
  );
}

export { ControlledSelectInput };
