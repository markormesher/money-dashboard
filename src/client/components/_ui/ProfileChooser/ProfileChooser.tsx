import { Component, ReactNode } from "react";
import * as React from "react";
import { combine } from "../../../helpers/style-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { ButtonDropDown } from "../ButtonDropDown/ButtonDropDown";
import { IProfile } from "../../../../models/IProfile";
import { setActiveProfile, getAllProfiles, getCurrentUser } from "../../../api/users-and-profiles";

type ProfileChooserState = {
  readonly activeProfile: IProfile;
  readonly allProfiles: IProfile[];
  readonly chooserOpen: boolean;
};

class ProfileChooser extends Component<unknown, ProfileChooserState> {
  constructor(props: unknown) {
    super(props);

    this.state = {
      activeProfile: null,
      allProfiles: null,
      chooserOpen: false,
    };

    this.renderChooser = this.renderChooser.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
  }

  public async componentDidMount(): Promise<void> {
    const allProfiles = await getAllProfiles();
    const currentUser = await getCurrentUser();
    this.setState({ allProfiles, activeProfile: currentUser.activeProfile });
  }

  public render(): ReactNode {
    const { chooserOpen, activeProfile } = this.state;

    if (!activeProfile) {
      return null;
    }

    return (
      <ButtonDropDown
        icon={"group"}
        text={activeProfile.name}
        onBtnClick={this.handleBtnClick}
        btnProps={{
          className: combine(bs.btnOutlineInfo),
        }}
        dropDownContents={chooserOpen ? this.renderChooser() : null}
      />
    );
  }

  private renderChooser(): ReactNode {
    const { activeProfile, allProfiles } = this.state;

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
                onClick={this.handleProfileClick}
                disabled={activeProfile.id == p.id}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  private handleBtnClick(): void {
    this.setState({ chooserOpen: !this.state.chooserOpen });
  }

  private async handleProfileClick(event: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    this.setState({ chooserOpen: false });
    const profileId = (event.target as HTMLButtonElement).id.replace("profile-option-", "");
    try {
      await setActiveProfile(profileId);
      window.location.reload();
    } catch (error) {
      // TODO: error handling
    }
  }
}

export { ProfileChooser };
