import { Currency } from "../../api_gen/moneydashboard/v4/currencies_pb.js";
import { GBP_CURRENCY } from "../../config/consts.js";

function formatCurrencyValue(amount: number, currency: Currency | null): string {
  if (currency === null) {
    currency = GBP_CURRENCY;
  }

  return amount.toLocaleString(undefined, {
    minimumFractionDigits: currency.displayPrecision,
    maximumFractionDigits: currency.displayPrecision,
  });
}

function formatCurrencyValueAsMagnitude(amount: number): string {
  if (amount < 1_000) {
    return "£" + amount.toFixed(0);
  } else if (amount < 1_000_000) {
    return "£" + (amount / 1_000).toFixed(0) + "K";
  } else if (amount < 1_000_000_000) {
    // we can dream
    return "£" + (amount / 1_000_000).toFixed(1) + "M";
  } else {
    // probably a dream too far
    return "£" + (amount / 1_000_000_000).toFixed(1) + "B";
  }
}

export { formatCurrencyValue, formatCurrencyValueAsMagnitude };
