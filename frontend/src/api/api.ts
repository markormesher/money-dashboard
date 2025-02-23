import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { MDAccountService } from "../api_gen/moneydashboard/v4/accounts_pb.js";
import { MDAssetService } from "../api_gen/moneydashboard/v4/assets_pb.js";
import { MDCategoryService } from "../api_gen/moneydashboard/v4/categories_pb.js";
import { MDCurrencyService } from "../api_gen/moneydashboard/v4/currencies_pb.js";
import { MDHoldingService } from "../api_gen/moneydashboard/v4/holdings_pb.js";
import { MDProfileService } from "../api_gen/moneydashboard/v4/profiles_pb.js";
import { MDTransactionService } from "../api_gen/moneydashboard/v4/transactions_pb.js";
import { MDUserService } from "../api_gen/moneydashboard/v4/users_pb.js";

const apiTransport = createConnectTransport({ baseUrl: "/" });

const accountServiceClient = createClient(MDAccountService, apiTransport);
const assetServiceClient = createClient(MDAssetService, apiTransport);
const categoryServiceClient = createClient(MDCategoryService, apiTransport);
const currencyServiceClient = createClient(MDCurrencyService, apiTransport);
const holdingServiceClient = createClient(MDHoldingService, apiTransport);
const profileServiceClient = createClient(MDProfileService, apiTransport);
const transactionServiceClient = createClient(MDTransactionService, apiTransport);
const userServiceClient = createClient(MDUserService, apiTransport);

export {
  accountServiceClient,
  assetServiceClient,
  categoryServiceClient,
  currencyServiceClient,
  holdingServiceClient,
  profileServiceClient,
  transactionServiceClient,
  userServiceClient,
};
