import { ITransaction } from "../ITransaction";
import { GLOBAL_MIN_DATE } from "../../utils/dates";
import { formatDate } from "../../../client/helpers/formatters";

interface ITransactionValidationResult {
  readonly isValid: boolean;
  readonly errors: {
    readonly account?: string;
    readonly category?: string;
    readonly amount?: string;
    readonly payee?: string;
    readonly transactionDate?: string;
    readonly effectiveDate?: string;
    readonly note?: string;
  };
}

function validateTransaction(transaction: ITransaction): ITransactionValidationResult {
  if (!transaction) {
    return {
      isValid: false,
      errors: {},
    };
  }

  let result: ITransactionValidationResult = {
    isValid: true,
    errors: {},
  };

  if (!transaction.account || !transaction.account.id || transaction.account.id.trim() === "") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        account: "An account must be selected",
      },
    };
  }

  if (!transaction.category || !transaction.category.id || transaction.category.id.trim() === "") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        category: "A category must be selected",
      },
    };
  }

  if ((!transaction.amount && transaction.amount !== 0) || isNaN(transaction.amount)) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        amount: "The amount must be a valid number",
      },
    };
  }

  if (!transaction.payee || transaction.payee.trim() === "") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        payee: "A payee must be entered",
      },
    };
  }

  if (!transaction.transactionDate) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        transactionDate: "A valid transaction date must be selected",
      },
    };
  }

  if (transaction.transactionDate < GLOBAL_MIN_DATE) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        transactionDate: `The transaction date must be after ${formatDate(GLOBAL_MIN_DATE)}`,
      },
    };
  }

  if (!transaction.effectiveDate) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        effectiveDate: "A valid effective date must be selected",
      },
    };
  }

  if (transaction.effectiveDate < GLOBAL_MIN_DATE) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        effectiveDate: `The effective date must be after ${formatDate(GLOBAL_MIN_DATE)}`,
      },
    };
  }

  return result;
}

export { ITransactionValidationResult, validateTransaction };
