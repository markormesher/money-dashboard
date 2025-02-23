import React, { ReactElement } from "react";
import { ExternalModalProps, Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { profileServiceClient, userServiceClient } from "../../../api/api.js";
import { useAsyncEffect, useAsyncHandler } from "../../utils/hooks.js";
import { toastBus } from "../toaster/toaster.js";
import { User } from "../../../api_gen/moneydashboard/v4/users_pb.js";
import { Profile } from "../../../api_gen/moneydashboard/v4/profiles_pb.js";

type ProfileChooserProps = ExternalModalProps & {};

function ProfileChooser(props: ProfileChooserProps): ReactElement {
  const [user, setUser] = React.useState<User>();
  const [profiles, setProfiles] = React.useState<Profile[]>();

  useAsyncEffect(async () => {
    if (!props.open) {
      return;
    }

    try {
      const res = await userServiceClient.getUser({});
      setUser(res.user);
    } catch (e) {
      toastBus.error("Failed to load user");
      console.log(e);
    }
  }, [props.open]);

  useAsyncEffect(async () => {
    if (!props.open) {
      return;
    }

    try {
      const res = await profileServiceClient.getAllProfiles({});
      setProfiles(res.profiles);
    } catch (e) {
      toastBus.error("Failed to load profiles");
      console.log(e);
    }
  }, [props.open]);

  const selectProfile = useAsyncHandler(async (profile: Profile) => {
    try {
      await userServiceClient.setActiveProfile({ profile });
      window.location.reload();
    } catch (e) {
      toastBus.error("Failed to set active profile");
      console.log(e);
    }
  });

  const header = (
    <IconGroup>
      <Icon name={"person"} />
      <span>Select Your Profile</span>
    </IconGroup>
  );

  let content: ReactElement;

  if (!user || !profiles) {
    content = <p aria-busy="true">Loading</p>;
  } else {
    content = (
      <ul>
        {profiles
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((p) => {
            let decoration: ReactElement;
            if (p.id == user?.activeProfile?.id) {
              decoration = <em>active now</em>;
            } else {
              decoration = (
                <a href={"#"} className={"secondary"} onClick={() => selectProfile(p)}>
                  select
                </a>
              );
            }

            return (
              <li>
                {p.name} - {decoration}
              </li>
            );
          })}
      </ul>
    );
  }

  return (
    <Modal {...props} header={header}>
      {content}
    </Modal>
  );
}

export { ProfileChooser };
