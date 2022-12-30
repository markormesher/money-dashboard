import { IEnvelopeTransfer } from "../IEnvelopeTransfer";
import { GLOBAL_MIN_DATE } from "../../utils/dates";

interface IEnvelopeTransferValidationResult {
  readonly isValid: boolean;
  readonly errors: {
    readonly date?: string;
    readonly amount?: string;
    readonly fromEnvelope?: string;
    readonly toEnvelope?: string;
    readonly note?: string;
  };
}

function validateEnvelopeTransfer(transfer: IEnvelopeTransfer): IEnvelopeTransferValidationResult {
  if (!transfer) {
    return {
      isValid: false,
      errors: {},
    };
  }

  let result: IEnvelopeTransferValidationResult = {
    isValid: true,
    errors: {},
  };

  if (!transfer.fromEnvelope || !transfer.fromEnvelope.id || transfer.fromEnvelope.id.trim() === "") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        fromEnvelope: "A source envelope must be selected",
      },
    };
  }

  if (!transfer.toEnvelope || !transfer.toEnvelope.id || transfer.toEnvelope.id.trim() === "") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        toEnvelope: "A source envelope must be selected",
      },
    };
  }

  if (!transfer.date) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        date: "A valid date must be selected",
      },
    };
  }

  if (transfer.date < GLOBAL_MIN_DATE) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        date: "The date must be after the global minimum",
      },
    };
  }

  if ((!transfer.amount && transfer.amount !== 0) || isNaN(transfer.amount)) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        amount: "The amount must be a valid number",
      },
    };
  }

  return result;
}

export { IEnvelopeTransferValidationResult, validateEnvelopeTransfer };
