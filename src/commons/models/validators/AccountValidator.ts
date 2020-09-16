import { IAccount, ACCOUNT_TAG_DISPLAY_NAMES } from "../IAccount";
import { ALL_CURRENCY_CODES } from "../ICurrency";

interface IAccountValidationResult {
  readonly isValid: boolean;
  readonly errors: {
    readonly name?: string;
    readonly type?: string;
    readonly tags?: string;
    readonly note?: string; // TODO: remove if unused
    readonly currencyCode?: string;
  };
}

function validateAccount(account: IAccount): IAccountValidationResult {
  if (!account) {
    return {
      isValid: false,
      errors: {},
    };
  }

  let result: IAccountValidationResult = {
    isValid: true,
    errors: {},
  };

  if (!account.name || account.name.trim() === "") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        name: "The name must not be blank",
      },
    };
  }

  if (!account.type || ["current", "savings", "asset", "other"].indexOf(account.type) < 0) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        type: "A valid account type must be selected",
      },
    };
  }

  if (account.tags && !account.tags.every((t) => !!ACCOUNT_TAG_DISPLAY_NAMES[t])) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        tags: "Only valid tags may be selected",
      },
    };
  }

  if (!ALL_CURRENCY_CODES.includes(account.currencyCode)) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        currencyCode: "A valid currency must be selected",
      },
    };
  }

  return result;
}

export { IAccountValidationResult, validateAccount };
