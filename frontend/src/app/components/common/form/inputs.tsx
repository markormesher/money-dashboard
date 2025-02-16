import React, { InputHTMLAttributes, ReactElement, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
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
    <label aria-disabled={formState.wg.count > 0}>
      {labelAfterInput ? null : label}
      <input
        name={fieldName}
        disabled={formState.wg.count > 0}
        aria-invalid={userHasInteracted && hasError ? true : undefined}
        onBlur={() => setUserHasInteracted(true)}
        autoComplete={"off"}
        {...props}
      />
      {labelAfterInput ? label : null}
      {userHasInteracted && hasError ? <small>{error}</small> : null}
    </label>
  );
}

type TextareaProps<T> = FormInputProps<T> & TextareaHTMLAttributes<HTMLTextAreaElement>;

function Textarea<T>(props: TextareaProps<T>): ReactElement {
  const { label, formState, fieldName } = props;
  const [userHasInteracted, setUserHasInteracted] = React.useState(false);

  const error = formState.fieldError(fieldName);
  const hasError = !!error;

  return (
    <label aria-disabled={formState.wg.count > 0}>
      {label}
      <textarea
        name={fieldName}
        disabled={formState.wg.count > 0}
        aria-invalid={userHasInteracted && hasError ? true : undefined}
        onBlur={() => setUserHasInteracted(true)}
        autoComplete={"off"}
        {...props}
      />
      {userHasInteracted && hasError ? <small>{error}</small> : null}
    </label>
  );
}

type SelectProps<T> = FormInputProps<T> & SelectHTMLAttributes<HTMLSelectElement>;

function Select<T>(props: React.PropsWithChildren<SelectProps<T>>): ReactElement {
  const { label, formState, fieldName, children } = props;
  const [userHasInteracted, setUserHasInteracted] = React.useState(false);

  const error = formState.fieldError(fieldName);
  const hasError = !!error;

  return (
    <label aria-disabled={formState.wg.count > 0}>
      {label}
      <select
        name={fieldName}
        disabled={formState.wg.count > 0}
        aria-invalid={userHasInteracted && hasError ? true : undefined}
        onBlur={() => setUserHasInteracted(true)}
        autoComplete={"off"}
        {...props}
      >
        <option selected={!props.value}>-- Select --</option>
        {children}
      </select>
      {userHasInteracted && hasError ? <small>{error}</small> : null}
    </label>
  );
}

export { Input, Textarea, Select };
