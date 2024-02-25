import * as React from "react";
import { combine } from "../../../helpers/style-helpers";
import bs from "../../../global-styles/Bootstrap.scss";
import { ButtonDropDown } from "../ButtonDropDown/ButtonDropDown";
import { IProfile } from "../../../../models/IProfile";
import { UserApi, ProfileApi } from "../../../api/users-and-profiles";
import { globalErrorManager } from "../../../helpers/errors/error-manager";
import { IUser } from "../../../../models/IUser";

function ProfileChooser(): React.ReactElement | null {
  const [currentUser, setCurrentUser] = React.useState<IUser>();
  const [allProfiles, setAllProfiles] = React.useState<IProfile[]>();
  const [switchInProgress, setSwitchInProgress] = React.useState(false);
  const [chooserOpen, setChooserOpen] = React.useState(false);

  React.useEffect(() => {
    UserApi.getCurrentUser()
      .then(setCurrentUser)
      .catch((err) => {
        globalErrorManager.emitFatalError("Failed to load current user", err);
      });

    ProfileApi.getAllProfiles()
      .then(setAllProfiles)
      .catch((err) => {
        globalErrorManager.emitFatalError("Failed to load user profiles", err);
      });
  }, []);

  if (!currentUser) {
    return null;
  }

  function handleProfileChange(profileId: string): void {
    setSwitchInProgress(true);
    ProfileApi.setActiveProfile(profileId)
      .then(() => {
        window.location.reload();
      })
      .catch((err) => {
        globalErrorManager.emitFatalError("Failed to switch user profile", err);
      });
  }

  function renderChooser(): React.ReactElement {
    if (!allProfiles) {
      return (
        <div className={bs.row}>
          <div className={bs.col}>
            <div className={bs.btnGroupVertical}>
              <button className={combine(bs.btn, bs.btnOutlineDark)} disabled={true}>
                Loading...
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={bs.row}>
        <div className={bs.col}>
          <div className={bs.btnGroupVertical}>
            {allProfiles.map((p) => (
              <button
                id={`profile-option-${p.id}`}
                key={p.id}
                className={combine(bs.btn, bs.btnOutlineDark)}
                onClick={() => handleProfileChange(p.id)}
                disabled={currentUser?.activeProfile?.id == p.id}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ButtonDropDown
      icon={switchInProgress ? "hourglass_empty" : "group"}
      iconProps={{ spin: switchInProgress }}
      text={switchInProgress ? "Switching..." : currentUser.activeProfile.name}
      onBtnClick={() => setChooserOpen(!chooserOpen)}
      btnProps={{
        className: combine(bs.btnOutlineInfo),
      }}
      dropDownContents={!switchInProgress && chooserOpen ? renderChooser() : null}
    />
  );
}

export { ProfileChooser };
