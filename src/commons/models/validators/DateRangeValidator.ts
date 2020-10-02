import { isAfter, isSameDay } from "date-fns";
import { IDateRange } from "../IDateRange";
import { GLOBAL_MIN_DATE } from "../../utils/dates";

interface IDateRangeValidationResult {
  readonly isValid: boolean;
  readonly errors: {
    readonly startDate?: string;
    readonly endDate?: string;
  };
}

function validateDateRange(range: IDateRange): IDateRangeValidationResult {
  if (!range) {
    return {
      isValid: false,
      errors: {},
    };
  }

  let result: IDateRangeValidationResult = {
    isValid: true,
    errors: {},
  };

  if (!range.startDate) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        startDate: "A valid start date date must be selected",
      },
    };
  }

  if (!range.endDate) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        endDate: "A valid end date date must be selected",
      },
    };
  }

  if (range.startDate < GLOBAL_MIN_DATE) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        startDate: "The start date must not be before the global minimum",
      },
    };
  }

  if (range.endDate < GLOBAL_MIN_DATE) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        endDate: "The end date must not be before the global minimum",
      },
    };
  }

  if (
    range.startDate &&
    range.endDate &&
    (isAfter(range.startDate, range.endDate) || isSameDay(range.startDate, range.endDate))
  ) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        startDate: "The start date date must be before the end date date",
        endDate: "The start date date must be before the end date date",
      },
    };
  }

  return result;
}

export { IDateRangeValidationResult, validateDateRange };
