import { IAccount, ACCOUNT_TAG_DISPLAY_NAMES } from "../IAccount";

interface IAccountValidationResult {
  readonly isValid: boolean;
  readonly errors: {
    readonly name?: string;
    readonly type?: string;
    readonly tags?: string;
    readonly note?: string; // TODO: remove if unused
    readonly currency?: string;
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

  if (account.currency !== "GBP") {
    // TODO: update once we have multi-currency support
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        currency: "Only GBP accounts are supported at the moment",
      },
    };
  }

  return result;
}

export { IAccountValidationResult, validateAccount };
