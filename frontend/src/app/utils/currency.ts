import { Currency } from "../../api_gen/moneydashboard/v4/currencies_pb.js";

function formatCurrency(amount: number, currency: Currency): string {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: currency.displayPrecision,
    maximumFractionDigits: currency.displayPrecision,
  });
}

export { formatCurrency };
