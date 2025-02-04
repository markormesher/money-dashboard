import React, { ReactElement } from "react";
import { ExternalModalProps, Modal } from "../modal/modal";
import { Icon, IconGroup } from "../icon/icon";
import { Profile } from "../../../api_gen/moneydashboard/v4/moneydashboard_pb";
import { apiClient } from "../../../api/api";

type ProfileChooserProps = ExternalModalProps & {};

function ProfileChooser(props: ProfileChooserProps): ReactElement {
  const [profiles, setProfiles] = React.useState<Profile[]>();
  React.useEffect(() => {
    apiClient
      .getProfiles({})
      .then((res) => {
        setProfiles(res.profiles);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const header = (
    <IconGroup>
      <Icon name={"person"} />
      <span>Profile</span>
    </IconGroup>
  );

  return (
    <Modal {...props} header={header}>
      <ul>
        {profiles?.map((p) => {
          let decoration: ReactElement;
          if (true) {
            decoration = <em>active now</em>;
          } else {
            decoration = <em>active now</em>;
          }

          return (
            <li>
              {p.name} - {decoration}
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}

export { ProfileChooser };
