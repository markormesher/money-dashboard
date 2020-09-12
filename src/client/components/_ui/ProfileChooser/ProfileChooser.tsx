// TODO: testing for connected components like this

import { PureComponent, ReactNode } from "react";
import * as React from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { faUsers, faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { IProfile } from "../../../../commons/models/IProfile";
import { IRootState } from "../../../redux/root";
import {
  startLoadProfileList,
  startSetActiveProfile,
  IProfileAwareProps,
  mapStateToProfileAwareProps,
} from "../../../redux/profiles";
import { combine } from "../../../helpers/style-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { ButtonDropDown } from "../ButtonDropDown/ButtonDropDown";

interface IProfileChooserProps extends IProfileAwareProps {
  readonly profileList?: IProfile[];
  readonly profileSwitchInProgress?: boolean;

  readonly actions?: {
    readonly startLoadProfileList: () => AnyAction;
    readonly startSetActiveProfile: (profile: IProfile) => AnyAction;
  };
}

interface IProfileChooserState {
  readonly chooserOpen: boolean;
}

function mapStateToProps(state: IRootState, props: IProfileChooserProps): IProfileChooserProps {
  return {
    ...mapStateToProfileAwareProps(state),
    ...props,
    profileList: state.profiles.profileList,
    profileSwitchInProgress: state.profiles.profileSwitchInProgress,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IProfileChooserProps): IProfileChooserProps {
  return {
    ...props,
    actions: {
      startLoadProfileList: (): AnyAction => dispatch(startLoadProfileList()),
      startSetActiveProfile: (profile: IProfile): AnyAction => dispatch(startSetActiveProfile(profile)),
    },
  };
}

class UCProfileChooser extends PureComponent<IProfileChooserProps, IProfileChooserState> {
  constructor(props: IProfileChooserProps) {
    super(props);

    this.state = {
      chooserOpen: false,
    };

    this.renderChooser = this.renderChooser.bind(this);
    this.handleBtnClick = this.handleBtnClick.bind(this);
    this.handleProfileClick = this.handleProfileClick.bind(this);
  }

  public componentDidMount(): void {
    this.props.actions.startLoadProfileList();
  }

  public componentDidUpdate(): void {
    this.props.actions.startLoadProfileList();
  }

  public render(): ReactNode {
    const { activeProfile, profileList, profileSwitchInProgress } = this.props;
    const { chooserOpen } = this.state;

    if (!activeProfile || !profileList || profileList.length == 1) {
      return null;
    }

    return (
      <ButtonDropDown
        icon={profileSwitchInProgress ? faCircleNotch : faUsers}
        text={activeProfile.name}
        onBtnClick={this.handleBtnClick}
        btnProps={{
          className: combine(bs.btnOutlineInfo),
        }}
        iconProps={{
          spin: profileSwitchInProgress,
        }}
        dropDownContents={chooserOpen ? this.renderChooser() : null}
      />
    );
  }

  private renderChooser(): ReactNode {
    const { profileList, activeProfile } = this.props;
    return (
      <div className={bs.row}>
        <div className={bs.col}>
          <div className={bs.btnGroupVertical}>
            {profileList.map((p) => (
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

  private handleProfileClick(event: React.MouseEvent<HTMLButtonElement>): void {
    const profileId = (event.target as HTMLButtonElement).id.replace("profile-option-", "");
    const profile = this.props.profileList.find((p) => p.id === profileId);
    this.props.actions.startSetActiveProfile(profile);
    this.setState({ chooserOpen: false });
  }
}

export const ProfileChooser = connect(mapStateToProps, mapDispatchToProps)(UCProfileChooser);
