import { Currency } from "../api_gen/moneydashboard/v4/currencies_pb.js";

const GBP_CURRENCY_ID = "b3092a40-1802-46fd-9967-11c7ac3522c5";

const GBP_CURRENCY: Currency = {
  $typeName: "moneydashboard.v4.Currency",
  id: GBP_CURRENCY_ID,
  code: "GBP",
  symbol: "£",
  displayPrecision: 2,
  active: true,
};

const NULL_UUID = "00000000-0000-0000-0000-000000000000";

const PLATFORM_MINIMUM_DATE = new Date("2015-04-06");
const PLATFORM_MAXIMUM_DATE = new Date("2099-12-31");

export { GBP_CURRENCY_ID, GBP_CURRENCY, NULL_UUID, PLATFORM_MINIMUM_DATE, PLATFORM_MAXIMUM_DATE };
