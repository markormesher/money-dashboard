import { GLOBAL_MIN_DATE } from "../../utils/dates";

interface IDateValidationResult {
  readonly isValid: boolean;
  readonly errors: {
    readonly date?: string;
  };
}

function validateDate(date: number): IDateValidationResult {
  let result: IDateValidationResult = {
    isValid: true,
    errors: {},
  };

  if (!date) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        date: "A valid date must be selected",
      },
    };
  }

  if (date < GLOBAL_MIN_DATE) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        date: "The date must not be before the global minimum",
      },
    };
  }

  return result;
}

export { IDateValidationResult, validateDate };
