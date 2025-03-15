import { createClient } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { MDAccountGroupService } from "../api_gen/moneydashboard/v4/account_groups_pb.js";
import { MDAccountService } from "../api_gen/moneydashboard/v4/accounts_pb.js";
import { MDAssetService } from "../api_gen/moneydashboard/v4/assets_pb.js";
import { MDCategoryService } from "../api_gen/moneydashboard/v4/categories_pb.js";
import { MDCurrencyService } from "../api_gen/moneydashboard/v4/currencies_pb.js";
import { MDEnvelopeService } from "../api_gen/moneydashboard/v4/envelopes_pb.js";
import { MDEnvelopeAllocationService } from "../api_gen/moneydashboard/v4/envelope_allocations_pb.js";
import { MDHoldingService } from "../api_gen/moneydashboard/v4/holdings_pb.js";
import { MDProfileService } from "../api_gen/moneydashboard/v4/profiles_pb.js";
import { MDRateService } from "../api_gen/moneydashboard/v4/rates_pb.js";
import { MDReportingService } from "../api_gen/moneydashboard/v4/reporting_pb.js";
import { MDTransactionService } from "../api_gen/moneydashboard/v4/transactions_pb.js";
import { MDUserService } from "../api_gen/moneydashboard/v4/users_pb.js";

const apiTransport = createConnectTransport({ baseUrl: "/" });

const accountServiceClient = createClient(MDAccountService, apiTransport);
const accountGroupServiceClient = createClient(MDAccountGroupService, apiTransport);
const assetServiceClient = createClient(MDAssetService, apiTransport);
const categoryServiceClient = createClient(MDCategoryService, apiTransport);
const currencyServiceClient = createClient(MDCurrencyService, apiTransport);
const envelopeServiceClient = createClient(MDEnvelopeService, apiTransport);
const envelopeAllocationServiceClient = createClient(MDEnvelopeAllocationService, apiTransport);
const holdingServiceClient = createClient(MDHoldingService, apiTransport);
const profileServiceClient = createClient(MDProfileService, apiTransport);
const rateServiceClient = createClient(MDRateService, apiTransport);
const reportingServiceClient = createClient(MDReportingService, apiTransport);
const transactionServiceClient = createClient(MDTransactionService, apiTransport);
const userServiceClient = createClient(MDUserService, apiTransport);

export {
  accountServiceClient,
  accountGroupServiceClient,
  assetServiceClient,
  categoryServiceClient,
  currencyServiceClient,
  envelopeServiceClient,
  envelopeAllocationServiceClient,
  holdingServiceClient,
  profileServiceClient,
  rateServiceClient,
  reportingServiceClient,
  transactionServiceClient,
  userServiceClient,
};
