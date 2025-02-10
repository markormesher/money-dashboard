import React, { InputHTMLAttributes, ReactElement } from "react";
import { FormState } from "./hook";

type FormInputProps<T> = {
  label: string;
  formState: FormState<T>;
  fieldName: Extract<keyof T, string>;
};

type InputProps<T> = FormInputProps<T> & InputHTMLAttributes<HTMLInputElement>;

function Input<T>(props: InputProps<T>): ReactElement {
  const { label, formState, fieldName } = props;
  const [userHasInteracted, setUserHasInteracted] = React.useState(false);

  const error = formState.fieldError(fieldName);
  const hasError = !!error;

  const labelAfterInput = props.type == "checkbox";

  return (
    <label>
      {labelAfterInput ? null : label}
      <input
        name={fieldName}
        disabled={formState.busy}
        aria-invalid={userHasInteracted && hasError ? true : undefined}
        onBlur={() => setUserHasInteracted(true)}
        {...props}
      />
      {labelAfterInput ? label : null}
      {userHasInteracted && hasError ? <small>{error}</small> : null}
    </label>
  );
}

export { Input };
