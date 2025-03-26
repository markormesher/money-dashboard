import React, { ReactElement } from "react";
import { ExternalModalProps, Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { userServiceClient } from "../../../api/api.js";
import { useAsyncEffect, useAsyncHandler } from "../../utils/hooks.js";
import { toastBus } from "../toaster/toaster.js";
import { User } from "../../../api_gen/moneydashboard/v4/users_pb.js";
import { Profile } from "../../../api_gen/moneydashboard/v4/profiles_pb.js";
import { useProfileList } from "../../schema/hooks.js";
import { Tile, TileSet } from "../common/tile-set/tile-set.js";

type ProfileChooserProps = ExternalModalProps & {};

function ProfileChooser(props: ProfileChooserProps): ReactElement {
  const [user, setUser] = React.useState<User>();

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

  const profiles = useProfileList({
    dependencies: [props.open],
    onError: () => {
      toastBus.error("Failed to load profiles.");
    },
  });

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
      <TileSet>
        {profiles
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((p) => {
            if (p.id == user?.activeProfile?.id) {
              return (
                <Tile>
                  {p.name}
                  <span className={"separator"}>&#x2022;</span>
                  <em>Active now</em>
                </Tile>
              );
            } else {
              return (
                <Tile>
                  {p.name}
                  <span className={"separator"}>&#x2022;</span>
                  <a href={"#"} className={"secondary"} onClick={() => selectProfile(p)}>
                    Select
                  </a>
                </Tile>
              );
            }
          })}
      </TileSet>
    );
  }

  return (
    <Modal {...props} header={header}>
      {content}
    </Modal>
  );
}

export { ProfileChooser };
