import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { MDCurrencyService } from "../api_gen/moneydashboard/v4/currencies_pb";
import { MDUserService } from "../api_gen/moneydashboard/v4/users_pb";
import { MDAssetService } from "../api_gen/moneydashboard/v4/assets_pb";
import { MDCategoryService } from "../api_gen/moneydashboard/v4/categories_pb";

const apiTransport = createConnectTransport({ baseUrl: "/" });

const assetServiceClient = createClient(MDAssetService, apiTransport);
const categoryServiceClient = createClient(MDCategoryService, apiTransport);
const currencyServiceClient = createClient(MDCurrencyService, apiTransport);
const userServiceClient = createClient(MDUserService, apiTransport);

export { assetServiceClient, categoryServiceClient, currencyServiceClient, userServiceClient };
