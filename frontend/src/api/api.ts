import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { MDCurrencyService } from "../api_gen/moneydashboard/v4/currencies_pb";
import { MDUserService } from "../api_gen/moneydashboard/v4/users_pb";

const apiTransport = createConnectTransport({ baseUrl: "/" });

const currencyServiceClient = createClient(MDCurrencyService, apiTransport);
const userServiceClient = createClient(MDUserService, apiTransport);

export { currencyServiceClient, userServiceClient };
