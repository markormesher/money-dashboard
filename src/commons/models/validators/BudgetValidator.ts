import * as Moment from "moment";
import { IBudget } from "../IBudget";
import { validateDateRange } from "./DateRangeValidator";

interface IBudgetValidationResult {
  readonly isValid: boolean;
  readonly errors: {
    readonly category?: string;
    readonly type?: string;
    readonly amount?: string;
    readonly startDate?: string;
    readonly endDate?: string;
  };
}

function validateBudget(budget: IBudget): IBudgetValidationResult {
  if (!budget) {
    return {
      isValid: false,
      errors: {},
    };
  }

  let result: IBudgetValidationResult = {
    isValid: true,
    errors: {},
  };

  if (budget.type !== "bill" && budget.type !== "budget") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        type: "A valid type must be selected",
      },
    };
  }

  if ((!budget.amount && budget.amount !== 0) || isNaN(budget.amount)) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        amount: "The amount must be a valid number",
      },
    };
  } else if (budget.amount <= 0) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        amount: "The amount must be greater than zero",
      },
    };
  }

  if (!budget.category || !budget.category.id || budget.category.id.trim() === "") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        category: "A category must be selected",
      },
    };
  }

  const dateRangeValidationResult = validateDateRange({
    startDate: budget.startDate as Moment.Moment,
    endDate: budget.endDate as Moment.Moment,
  });
  if (dateRangeValidationResult.errors.startDate) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        startDate: dateRangeValidationResult.errors.startDate,
      },
    };
  }

  if (dateRangeValidationResult.errors.endDate) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        endDate: dateRangeValidationResult.errors.endDate,
      },
    };
  }

  return result;
}

export { IBudgetValidationResult, validateBudget };
