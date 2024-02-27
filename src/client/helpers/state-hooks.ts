import { useState } from "react";
import { IValidationResult } from "../../models/validators/IValidationResult";

function useNonceState(): [number, () => void] {
  const [nonce, setNonce] = useState<number>(0);

  function updateNonce(): void {
    setNonce(new Date().getTime());
  }

  return [nonce, updateNonce];
}

function useModelEditingState<Model>(
  initialValue: Model,
  validator: (values: Model) => IValidationResult<Model>,
): [Model, IValidationResult<Model>, (values: Partial<Model>) => void] {
  const [currentValues, setCurrentValues] = useState<Model>(initialValue);
  const [validationResult, setValidationResult] = useState<IValidationResult<Model>>(validator(initialValue));

  function updateModel(values: Partial<Model>): void {
    const updatedValues = {
      ...currentValues,
      ...values,
    };
    const updatedValidationResult = validator(updatedValues);
    setCurrentValues(updatedValues);
    setValidationResult(updatedValidationResult);
  }

  return [currentValues, validationResult, updateModel];
}

export { useNonceState, useModelEditingState };
