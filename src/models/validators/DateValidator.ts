import { GLOBAL_MIN_DATE } from "../../utils/dates";
import { IDate } from "../IDate";

type IDateValidationResult = {
  readonly isValid: boolean;
  readonly errors: {
    readonly date?: string;
  };
};

function validateDate(date: IDate): IDateValidationResult {
  let result: IDateValidationResult = {
    isValid: true,
    errors: {},
  };

  if (!date?.date) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        date: "A valid date must be selected",
      },
    };
  }

  if (date && date.date && date.date < GLOBAL_MIN_DATE) {
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
