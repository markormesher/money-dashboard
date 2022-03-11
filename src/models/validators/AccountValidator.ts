import { IAccount, ACCOUNT_TAG_DISPLAY_NAMES, ACCOUNT_TYPES } from "../IAccount";
import { ALL_CURRENCY_CODES, DEFAULT_CURRENCY_CODE } from "../ICurrency";
import { ALL_STOCK_TICKERS, getStock } from "../IStock";

interface IAccountValidationResult {
  readonly isValid: boolean;
  readonly errors: {
    readonly name?: string;
    readonly type?: string;
    readonly tags?: string;
    readonly currencyCode?: string;
    readonly stockTicker?: string;
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

  if (!account.type || ACCOUNT_TYPES.indexOf(account.type) < 0) {
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

  if (account.currencyCode !== DEFAULT_CURRENCY_CODE) {
    if (account.tags && account.tags.includes("pension")) {
      result = {
        isValid: false,
        errors: {
          ...result.errors,
          tags: "The pension tag cannot be used for non-GBP accounts",
        },
      };
    }

    if (account.tags && account.tags.includes("isa")) {
      result = {
        isValid: false,
        errors: {
          ...result.errors,
          tags: "The ISA tag cannot be used for non-GBP accounts",
        },
      };
    }
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

  if (account.stockTicker !== null && !ALL_STOCK_TICKERS.includes(account.stockTicker)) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        stockTicker: "A valid stock ticker must be selected",
      },
    };
  }

  if (
    account.stockTicker !== null &&
    ALL_STOCK_TICKERS.includes(account.stockTicker) &&
    account.currencyCode !== getStock(account.stockTicker).baseCurrency
  ) {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        currencyCode: "The account currency must match the base currecy of the stock selected",
      },
    };
  }

  if (account.stockTicker !== null && account.type !== "asset") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        stockTicker: "Stock tickers can only be selected on asset accounts",
      },
    };
  }

  return result;
}

export { IAccountValidationResult, validateAccount };
