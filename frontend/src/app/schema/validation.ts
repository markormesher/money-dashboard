import { Account } from "../../api_gen/moneydashboard/v4/accounts_pb.js";
import { Asset } from "../../api_gen/moneydashboard/v4/assets_pb.js";
import { Category } from "../../api_gen/moneydashboard/v4/categories_pb.js";
import { Currency } from "../../api_gen/moneydashboard/v4/currencies_pb.js";
import { Holding } from "../../api_gen/moneydashboard/v4/holdings_pb.js";
import { Transaction } from "../../api_gen/moneydashboard/v4/transactions_pb.js";
import { PLATFORM_MINIMUM_DATE } from "../../config/consts.js";
import { FormValidationResult } from "../components/common/form/hook.js";
import { parseDateFromProto } from "../utils/dates.js";

function validateAccount(value: Partial<Account>): FormValidationResult<Account> {
  const result: FormValidationResult<Account> = { isValid: true, errors: {} };

  if (value?.name === undefined) {
    result.isValid = false;
  } else {
    if (value.name.length < 1) {
      result.isValid = false;
      result.errors.name = "Name must be at least 1 character";
    }
  }

  if (value?.isIsa && value?.isPension) {
    result.isValid = false;
    result.errors.global = "ISA and pension status are mutually exclusive";
  }

  return result;
}

function validateAsset(value: Partial<Asset>): FormValidationResult<Asset> {
  const result: FormValidationResult<Asset> = { isValid: true, errors: {} };

  if (value?.name === undefined) {
    result.isValid = false;
  } else {
    if (value.name.length < 1) {
      result.isValid = false;
      result.errors.name = "Name must be at least 1 character";
    }
  }

  if (value?.currency === undefined) {
    result.isValid = false;
    result.errors.currency = "Currency must be selected";
  }

  if (value?.displayPrecision === undefined) {
    result.isValid = false;
  } else {
    if (isNaN(value.displayPrecision)) {
      result.isValid = false;
      result.errors.displayPrecision = "Display precision must be a valid number";
    } else if (value.displayPrecision < 0) {
      result.isValid = false;
      result.errors.displayPrecision = "Display precision must be at least 0";
    }
  }

  if (value?.calculationPrecision === undefined) {
    result.isValid = false;
  } else {
    if (isNaN(value.calculationPrecision)) {
      result.isValid = false;
      result.errors.calculationPrecision = "Calculation precision must be a valid number";
    } else if (value.calculationPrecision < 0) {
      result.isValid = false;
      result.errors.calculationPrecision = "Calculation precision must be at least 0";
    }
  }

  return result;
}

function validateCategory(value: Partial<Category>): FormValidationResult<Currency> {
  const result: FormValidationResult<Category> = { isValid: true, errors: {} };

  if (value?.name === undefined) {
    result.isValid = false;
  } else {
    if (value.name.length < 1) {
      result.isValid = false;
      result.errors.name = "Name must be at least 1 character";
    }
  }

  const mutuallyExclusiveFlags = [
    value?.isMemo,
    value?.isInterestIncome,
    value?.isDividendIncome,
    value?.isCapitalAcquisition,
    value?.isCapitalDisposal,
    value?.isCapitalEventFee,
  ].filter((v) => !!v).length;
  if (mutuallyExclusiveFlags > 1) {
    result.isValid = false;
    result.errors.global = "At most one mutually exclusive flag can be selected";
  }

  return result;
}

function validateCurrency(value: Partial<Currency>): FormValidationResult<Currency> {
  const result: FormValidationResult<Currency> = { isValid: true, errors: {} };

  if (value?.code === undefined) {
    result.isValid = false;
  } else {
    if (value.code.length < 2) {
      result.isValid = false;
      result.errors.code = "Code must be at least 2 characters";
    } else if (value.code.length > 6) {
      result.isValid = false;
      result.errors.code = "Code must be at most 6 characters";
    }
  }

  if (value?.symbol === undefined) {
    result.isValid = false;
  } else {
    if (value.symbol.length < 1) {
      result.isValid = false;
      result.errors.symbol = "Symbol must be at least 1 character";
    } else if (value.symbol.length > 2) {
      result.isValid = false;
      result.errors.symbol = "Symbol must be at most 2 characters";
    }
  }

  if (value?.displayPrecision === undefined) {
    result.isValid = false;
  } else {
    if (isNaN(value.displayPrecision)) {
      result.isValid = false;
      result.errors.displayPrecision = "Display precision must be a valid number";
    } else if (value.displayPrecision < 0) {
      result.isValid = false;
      result.errors.displayPrecision = "Display precision must be at least 0";
    }
  }

  if (value?.calculationPrecision === undefined) {
    result.isValid = false;
  } else {
    if (isNaN(value.calculationPrecision)) {
      result.isValid = false;
      result.errors.calculationPrecision = "Calculation precision must be a valid number";
    } else if (value.calculationPrecision < 0) {
      result.isValid = false;
      result.errors.calculationPrecision = "Calculation precision must be at least 0";
    }
  }

  return result;
}

function validateHolding(value: Partial<Holding>): FormValidationResult<Holding> {
  const result: FormValidationResult<Holding> = { isValid: true, errors: {} };

  if (value?.name === undefined) {
    result.isValid = false;
  } else {
    if (value.name.length < 1) {
      result.isValid = false;
      result.errors.name = "Name must be at least 1 character";
    }
  }

  if (value?.currency && value?.asset) {
    result.isValid = false;
    result.errors.global = "Only one of currency and asset can be selected";
  }

  if (!value?.currency && !value?.asset) {
    result.isValid = false;
    result.errors.global = "A currency or asset must be selected";
  }

  return result;
}

function validateTransaction(value: Partial<Transaction>): FormValidationResult<Transaction> {
  const result: FormValidationResult<Transaction> = { isValid: true, errors: {} };

  if (value?.date === undefined) {
    result.isValid = false;
  } else {
    const dateParsed = parseDateFromProto(value.date);
    if (isNaN(dateParsed.getTime())) {
      result.isValid = false;
      result.errors.date = "Invalid date";
    } else if (dateParsed.getTime() < PLATFORM_MINIMUM_DATE.getTime()) {
      result.isValid = false;
      result.errors.date = "Date must not be before the platform minimum";
    }
  }

  if (value?.budgetDate === undefined) {
    result.isValid = false;
  } else {
    const dateParsed = parseDateFromProto(value.budgetDate);
    if (isNaN(dateParsed.getTime())) {
      result.isValid = false;
      result.errors.budgetDate = "Invalid budget date";
    } else if (dateParsed.getTime() < PLATFORM_MINIMUM_DATE.getTime()) {
      result.isValid = false;
      result.errors.budgetDate = "Budget date must not be before the platform minimum";
    }
  }

  if (value?.payee === undefined) {
    result.isValid = false;
  } else {
    if (value.payee.length < 1) {
      result.isValid = false;
      result.errors.payee = "Payee must be at least 1 character";
    }
  }

  if (!value?.holding) {
    result.isValid = false;
    result.errors.holding = "A holding must be selected";
  }

  if (!value?.category) {
    result.isValid = false;
    result.errors.category = "A category must be selected";
  }

  if (value?.amount === undefined) {
    result.isValid = false;
  } else {
    if (isNaN(value.amount)) {
      result.isValid = false;
      result.errors.amount = "Amount must be valid";
    }
  }

  if (value?.unitValue === undefined) {
    result.isValid = false;
  } else {
    if (isNaN(value.unitValue)) {
      result.isValid = false;
      result.errors.unitValue = "Unit value must be valid";
    } else if (value.unitValue < 0) {
      result.isValid = false;
      result.errors.unitValue = "Unit value must be positive";
    }
  }

  // combination rules

  if ((value?.category?.isCapitalAcquisition || value?.category?.isCapitalDisposal) && !value?.holding?.asset) {
    result.isValid = false;
    result.errors.category = "This category is only valid for asset-backed holdings";
  }

  if (value?.category?.isCapitalAcquisition && (value?.amount ?? 0) <= 0) {
    result.isValid = false;
    result.errors.amount = "Capital acquisitions must be positive";
  }

  if (value?.category?.isCapitalDisposal && (value?.amount ?? 0) >= 0) {
    result.isValid = false;
    result.errors.amount = "Capital disposals must be negative";
  }

  if (value?.category?.isCapitalEventFee && (value?.amount ?? 0) >= 0) {
    result.isValid = false;
    result.errors.amount = "Capital event fees must be negative";
  }

  if ((value?.category?.isInterestIncome || value?.category?.isDividendIncome) && !value?.holding?.currency) {
    result.isValid = false;
    result.errors.category = "This category is only valid for cash-backed holdings";
  }

  if (value?.category?.isInterestIncome && (value?.amount ?? 0) <= 0) {
    result.isValid = false;
    result.errors.amount = "Interest income must be positive";
  }

  if (value?.category?.isDividendIncome && (value?.amount ?? 0) <= 0) {
    result.isValid = false;
    result.errors.amount = "Dividend income must be positive";
  }

  return result;
}

export { validateAccount, validateAsset, validateCategory, validateCurrency, validateHolding, validateTransaction };
