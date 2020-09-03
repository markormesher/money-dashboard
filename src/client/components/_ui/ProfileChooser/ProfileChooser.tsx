import { PureComponent, ReactNode } from "react";
import * as React from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { faUsers, faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { IProfile } from "../../../../commons/models/IProfile";
import { IRootState } from "../../../redux/root";
import { profileListIsCached, startLoadProfileList } from "../../../redux/profiles";
import { IconBtn } from "../IconBtn/IconBtn";
import { combine } from "../../../helpers/style-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";

interface IProfileChooserProps {
  readonly profileList?: IProfile[];
  readonly profileListIsCached?: boolean;
  readonly activeProfile?: IProfile;
  readonly profileSwitchInProgress?: boolean;

  readonly actions?: {
    readonly startLoadProfileList: () => AnyAction;
  };
}

function mapStateToProps(state: IRootState, props: IProfileChooserProps): IProfileChooserProps {
  return {
    ...props,
    profileList: state.profiles.profileList,
    profileListIsCached: profileListIsCached(),
    activeProfile: state.auth.activeUser.activeProfile,
    profileSwitchInProgress: state.profiles.profileSwitchInProgress,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IProfileChooserProps): IProfileChooserProps {
  return {
    ...props,
    actions: {
      startLoadProfileList: (): AnyAction => dispatch(startLoadProfileList()),
    },
  };
}

class UCProfileChooser extends PureComponent<IProfileChooserProps> {
  public componentDidMount(): void {
    this.props.actions.startLoadProfileList();
  }

  public componentDidUpdate(): void {
    if (!this.props.profileListIsCached) {
      this.props.actions.startLoadProfileList();
    }
  }

  public render(): ReactNode {
    const { activeProfile, profileList, profileSwitchInProgress } = this.props;

    if (!activeProfile || !profileList) {
      return null;
    }

    return (
      <>
        <IconBtn
          icon={profileSwitchInProgress ? faCircleNotch : faUsers}
          text={activeProfile.name}
          btnProps={{
            className: combine(bs.btnOutlineInfo),
          }}
          iconProps={{
            spin: profileSwitchInProgress,
          }}
        />
      </>
    );
  }
}

export const ProfileChooser = connect(mapStateToProps, mapDispatchToProps)(UCProfileChooser);
