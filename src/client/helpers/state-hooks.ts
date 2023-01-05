import { useState } from "react";

function useNonceState(): [number, () => void] {
  const [nonce, setNonce] = useState<number>(0);

  function updateNonce(): void {
    setNonce(new Date().getTime());
  }

  return [nonce, updateNonce];
}

function useModelEditingState<Model, ValidationResult>(
  initialValue: Model,
  validator: (values: Model) => ValidationResult,
): [Model, ValidationResult, (values: Partial<Model>) => void] {
  const [currentValues, setCurrentValues] = useState<Model>(initialValue);
  const [validationResult, setValidationResult] = useState<ValidationResult>(validator(initialValue));

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
