import { Currency } from "../../api_gen/moneydashboard/v4/currencies_pb.js";

function formatCurrency(amount: number, currency: Currency): string {
  return amount.toFixed(currency.displayPrecision);
}

export { formatCurrency };
