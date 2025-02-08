import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { MDService } from "../api_gen/moneydashboard/v4/main_pb";

const apiTransport = createConnectTransport({ baseUrl: "/" });
const apiClient = createClient(MDService, apiTransport);

export { apiTransport, apiClient };
