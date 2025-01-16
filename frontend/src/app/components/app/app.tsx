import React from "react";
import { ReactElement } from "react";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { User, MDService } from "../../../gen/moneydashboard/v4/moneydashboard_pb";

function App(): ReactElement {
  const apiTransport = createConnectTransport({ baseUrl: "/" });
  const apiClient = createClient(MDService, apiTransport);

  const [user, setUser] = React.useState<User>();
  React.useEffect(() => {
    apiClient
      .getCurrentUser({})
      .then((res) => {
        setUser(res.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <p>Current user: {user ? JSON.stringify(user) : "none"}</p>;
}

export { App };
