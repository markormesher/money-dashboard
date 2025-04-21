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
  const neg = amount < 0;
  const absAmount = Math.abs(amount);

  let out: string;
  if (absAmount < 1_000) {
    out = "£" + absAmount.toFixed(0);
  } else if (absAmount < 1_000_000) {
    out = "£" + (absAmount / 1_000).toFixed(0) + "K";
  } else if (absAmount < 1_000_000_000) {
    out = "£" + (absAmount / 1_000_000).toFixed(1) + "M";
  } else {
    out = "£" + (absAmount / 1_000_000_000).toFixed(1) + "B";
  }

  return (neg ? "-" : "") + out;
}

export { formatCurrencyValue, formatCurrencyValueAsMagnitude };
