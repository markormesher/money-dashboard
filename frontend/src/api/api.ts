import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { MDAccountService } from "../api_gen/moneydashboard/v4/accounts_pb";
import { MDAssetService } from "../api_gen/moneydashboard/v4/assets_pb";
import { MDCategoryService } from "../api_gen/moneydashboard/v4/categories_pb";
import { MDCurrencyService } from "../api_gen/moneydashboard/v4/currencies_pb";
import { MDHoldingService } from "../api_gen/moneydashboard/v4/holdings_pb";
import { MDUserService } from "../api_gen/moneydashboard/v4/users_pb";

const apiTransport = createConnectTransport({ baseUrl: "/" });

const accountServiceClient = createClient(MDAccountService, apiTransport);
const assetServiceClient = createClient(MDAssetService, apiTransport);
const categoryServiceClient = createClient(MDCategoryService, apiTransport);
const currencyServiceClient = createClient(MDCurrencyService, apiTransport);
const holdingServiceClient = createClient(MDHoldingService, apiTransport);
const userServiceClient = createClient(MDUserService, apiTransport);

export {
  accountServiceClient,
  assetServiceClient,
  categoryServiceClient,
  currencyServiceClient,
  holdingServiceClient,
  userServiceClient,
};
