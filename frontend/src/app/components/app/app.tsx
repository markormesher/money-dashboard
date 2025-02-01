import React from "react";
import { ReactElement } from "react";
import { createConnectTransport } from "@connectrpc/connect-web";
import { createClient } from "@connectrpc/connect";
import { User, MDService, Profile } from "../../../api_gen/moneydashboard/v4/moneydashboard_pb";

function App(): ReactElement {
  const apiTransport = createConnectTransport({ baseUrl: "/" });
  const apiClient = createClient(MDService, apiTransport);

  const [user, setUser] = React.useState<User>();
  React.useEffect(() => {
    apiClient
      .getUser({})
      .then((res) => {
        setUser(res.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [profiles, setProfiles] = React.useState<Profile[]>();
  React.useEffect(() => {
    if (!user) {
      return;
    }

    apiClient
      .getProfiles({})
      .then((res) => {
        setProfiles(res.profiles);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  function setActiveProfile(id: string) {
    apiClient
      .setActiveProfile({ profileId: id })
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <p>User:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>Profiles:</p>
      <pre>{JSON.stringify(profiles, null, 2)}</pre>
      <p>
        <select onChange={(evt) => setActiveProfile(evt.target.value)}>
          {profiles?.map((p) => (
            <option key={p.id} value={p.id} selected={user?.activeProfile?.id == p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </p>
    </>
  );
}

export { App };
