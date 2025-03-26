import React from "react";
import { deepEqual } from "../../../utils/utils.js";
import { useWaitGroup, WaitGroup } from "../../../utils/hooks.js";

type ErrorKey<T> = "global" | Extract<keyof T, string>;

type FormValidationResult<T> = {
  isValid: boolean;
  errors: Partial<Record<ErrorKey<T>, string>>;
};

type FormHookOptions<T> = {
  validator?: (model: Partial<T>) => FormValidationResult<T>;
};

type FormState<T> = {
  model: T | undefined;
  modelIteration: number;
  setModel: (model: T | undefined) => void;
  patchModel: (patch: Partial<T>) => void;

  valid: boolean;
  fieldError: (name: ErrorKey<T>) => string | undefined;

  modified: boolean;

  wg: WaitGroup;

  fatalError: unknown;
  setFatalError: (error: unknown) => void;
};

function useForm<T>(options: FormHookOptions<T> = {}): FormState<T> {
  const { validator } = options;

  const [originalModel, setOriginalModel] = React.useState<T>();
  const [modelIteration, setModelIteration] = React.useState(0);
  const [model, setModelInner] = React.useState<T>();

  const [validationResult, setValidationResult] = React.useState<FormValidationResult<T>>({
    isValid: false,
    errors: {},
  });
  const [valid, setValid] = React.useState(false);

  const [modified, setModified] = React.useState(false);
  const [fatalError, setFatalError] = React.useState<unknown>();
  const wg = useWaitGroup();

  const setModel = (m: T | undefined) => {
    setOriginalModel(m);
    setModelIteration((curr) => curr + 1);
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

  const fieldError = (key: ErrorKey<T>) => {
    return validationResult.errors[key];
  };

  return {
    model,
    modelIteration,
    setModel,
    patchModel,
    valid,
    fieldError,
    modified,
    wg,
    fatalError,
    setFatalError,
  };
}

export { useForm };
export type { FormState, FormValidationResult };
