interface IValidationResult<Model> {
  readonly isValid: boolean;
  readonly errors: Partial<Record<keyof Model, string>>;
}

export { IValidationResult };
