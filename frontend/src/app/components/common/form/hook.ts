import React from "react";
import { deepEqual } from "../../../utils/utils";

type FormValidationResult<T> = {
  isValid: boolean;
  errors: Partial<Record<Extract<keyof T, string>, string>>;
};

type FormHookOptions<T> = {
  validator?: (model: Partial<T>) => FormValidationResult<T>;
};

type FormState<T> = {
  model: T | undefined;
  setModel: (model: T | undefined) => void;
  patchModel: (patch: Partial<T>) => void;

  valid: boolean;
  fieldError: (name: Extract<keyof T, string>) => string | undefined;

  busy: boolean;
  setBusy: (busy: boolean) => void;

  modified: boolean;

  fatalError: unknown;
  setFatalError: (busy: unknown) => void;
};

function useForm<T>(options: FormHookOptions<T> = {}): FormState<T> {
  const { validator } = options;

  const [originalModel, setOriginalModel] = React.useState<T>();
  const [model, setModelInner] = React.useState<T>();
  const [validationResult, setValidationResult] = React.useState<FormValidationResult<T>>({
    isValid: false,
    errors: {},
  });
  const [valid, setValid] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [modified, setModified] = React.useState(false);
  const [fatalError, setFatalError] = React.useState<unknown>();

  const setModel = (m: T | undefined) => {
    setOriginalModel(m);
    setModelInner(m);
  };

  const patchModel = (m: Partial<T>) => {
    setModelInner((curr) => {
      if (!curr) {
        console.warn("Cannot patch model when the initial model has not been set");
        return;
      }

      return { ...curr, ...m };
    });
  };

  React.useEffect(() => {
    setModified(!deepEqual(model, originalModel));
  }, [model, originalModel]);

  React.useEffect(() => {
    if (validator && model) {
      setValidationResult(validator(model));
    } else {
      setValidationResult({ isValid: true, errors: {} });
    }
    setModified(!deepEqual(model, originalModel));
  }, [model]);

  React.useEffect(() => {
    setValid(validationResult.isValid);
  }, [validationResult]);

  const fieldError = (name: Extract<keyof T, string>) => {
    return validationResult.errors[name];
  };

  return {
    model,
    setModel,
    patchModel,
    valid,
    fieldError,
    busy,
    setBusy,
    modified,
    fatalError,
    setFatalError,
  };
}

export { useForm };
export type { FormState, FormValidationResult };
