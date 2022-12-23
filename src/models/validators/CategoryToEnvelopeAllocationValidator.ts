import { ICategoryToEnvelopeAllocation } from "../ICategoryToEnvelopeAllocation";
import { GLOBAL_MIN_DATE } from "../../utils/dates";

interface ICategoryToEnvelopeAllocationValidationResult {
  readonly isValid: boolean;
  readonly errors: {
    readonly category?: string;
    readonly envelope?: string;
    readonly startDate?: string;
  };
}

function validateEnvelopeAllocation(
  allocation: ICategoryToEnvelopeAllocation,
): ICategoryToEnvelopeAllocationValidationResult {
  if (!allocation) {
    return {
      isValid: false,
      errors: {},
    };
  }

  let result: ICategoryToEnvelopeAllocationValidationResult = {
    isValid: true,
    errors: {},
  };

  if (!allocation.category || !allocation.category.id || allocation.category.id.trim() === "") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        category: "A category must be selected",
      },
    };
  }

  if (!allocation.envelope || !allocation.envelope.id || allocation.envelope.id.trim() === "") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        envelope: "A envelope must be selected",
      },
    };
  }

  if (!allocation.startDate) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        startDate: "A valid start date must be selected",
      },
    };
  }

  if (allocation.startDate < GLOBAL_MIN_DATE) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        startDate: "The start date must be after the global minimum",
      },
    };
  }

  return result;
}

export { ICategoryToEnvelopeAllocationValidationResult, validateEnvelopeAllocation };
