import * as React from "react";
import { parseISO } from "date-fns";
import bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";

type ControlledDateInputProps = {
  readonly id: string;
  readonly label: string | React.ReactElement<void>;
  readonly value: string | number;
  readonly onValueChange: (newValue: number | undefined, id: string) => void;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly inputProps?: Partial<React.InputHTMLAttributes<HTMLInputElement>>;
};

function ControlledDateInput(props: ControlledDateInputProps): React.ReactElement {
  const { id, label, value, onValueChange, disabled, error, inputProps } = props;
  const [touched, setTouched] = React.useState(false);

  function handleChange(event: React.FormEvent<HTMLInputElement>): void {
    const newValue = (event.target as HTMLInputElement).value;
    if (!newValue || newValue.trim() === "") {
      onValueChange(undefined, id);
    } else {
      onValueChange(parseISO(newValue).getTime(), id);
    }
  }

  return (
    <>
      <label htmlFor={id} className={bs.formLabel}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type="date"
        onChange={handleChange}
        disabled={disabled !== false}
        className={combine(bs.formControl, touched && error && bs.isInvalid)}
        value={value}
        onBlur={() => setTouched(true)}
        {...inputProps}
      />
      {error && touched && <div className={bs.invalidFeedback}>{error}</div>}
    </>
  );
}

export { ControlledDateInput };
