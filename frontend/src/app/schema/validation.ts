import { Asset } from "../../api_gen/moneydashboard/v4/assets_pb";
import { Category } from "../../api_gen/moneydashboard/v4/categories_pb";
import { Currency } from "../../api_gen/moneydashboard/v4/currencies_pb";
import { FormValidationResult } from "../components/common/form/hook";

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

export { validateAsset, validateCategory, validateCurrency };
