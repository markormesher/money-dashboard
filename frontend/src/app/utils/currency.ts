import { Currency } from "../../api_gen/moneydashboard/v4/currencies_pb.js";
import { GBP_CURRENCY } from "../../config/consts.js";

function formatCurrency(amount: number, currency: Currency | null): string {
  if (currency === null) {
    currency = GBP_CURRENCY;
  }

  return amount.toLocaleString(undefined, {
    minimumFractionDigits: currency.displayPrecision,
    maximumFractionDigits: currency.displayPrecision,
  });
}

export { formatCurrency };
