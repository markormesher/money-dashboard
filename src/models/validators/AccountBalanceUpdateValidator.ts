import { IAccountBalanceUpdate } from "../IAccountBalanceUpdate";
import { GLOBAL_MIN_DATE } from "../../utils/dates";

type IAccountBalanceUpdateValidationResult = {
  readonly isValid: boolean;
  readonly errors: {
    readonly account?: string;
    readonly balance?: string;
    readonly updateDate?: string;
  };
};

function validateAccountBalanceUpdate(
  accountBalanceUpdate: IAccountBalanceUpdate,
): IAccountBalanceUpdateValidationResult {
  if (!accountBalanceUpdate) {
    return {
      isValid: false,
      errors: {},
    };
  }

  let result: IAccountBalanceUpdateValidationResult = {
    isValid: true,
    errors: {},
  };

  if (!accountBalanceUpdate.account?.id || accountBalanceUpdate.account.id.trim() === "") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        account: "An account must be selected",
      },
    };
  }

  if ((!accountBalanceUpdate.balance && accountBalanceUpdate.balance !== 0) || isNaN(accountBalanceUpdate.balance)) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        balance: "The balance must be a valid number",
      },
    };
  }

  if (!accountBalanceUpdate.updateDate) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        updateDate: "A valid update date must be selected",
      },
    };
  }

  if (accountBalanceUpdate.updateDate < GLOBAL_MIN_DATE) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        updateDate: "The update date must be after the global minimum",
      },
    };
  }

  return result;
}

export { IAccountBalanceUpdateValidationResult, validateAccountBalanceUpdate };
