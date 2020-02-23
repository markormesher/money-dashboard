import { faHandPointer, faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IProfile, mapProfileFromApi } from "../../../commons/models/IProfile";
import { IUser } from "../../../commons/models/IUser";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { combine } from "../../helpers/style-helpers";
import { KeyCache } from "../../redux/helpers/KeyCache";
import { ProfileCacheKeys, setProfileToEdit, startDeleteProfile, startSetCurrentProfile } from "../../redux/profiles";
import { IRootState } from "../../redux/root";
import { Badge } from "../_ui/Badge/Badge";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { ProfileEditModal } from "../ProfileEditModal/ProfileEditModal";

interface IProfilesPageProps {
  readonly cacheTime: number;
  readonly profileToEdit?: IProfile;
  readonly profileSwitchInProgress: boolean;
  readonly activeUser?: IUser;
  readonly actions?: {
    readonly deleteProfile: (profile: IProfile) => AnyAction;
    readonly setProfileToEdit: (profile: IProfile) => AnyAction;
    readonly setCurrentProfile: (profile: IProfile) => AnyAction;
  };
}

function mapStateToProps(state: IRootState, props: IProfilesPageProps): IProfilesPageProps {
  return {
    ...props,
    cacheTime: Math.max(
      KeyCache.getKeyTime(ProfileCacheKeys.PROFILE_DATA),
      KeyCache.getKeyTime(ProfileCacheKeys.CURRENT_PROFILE),
    ),
    profileToEdit: state.profiles.profileToEdit,
    profileSwitchInProgress: state.profiles.profileSwitchInProgress,
    activeUser: state.auth.activeUser,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IProfilesPageProps): IProfilesPageProps {
  return {
    ...props,
    actions: {
      deleteProfile: (profile): AnyAction => dispatch(startDeleteProfile(profile)),
      setProfileToEdit: (profile): AnyAction => dispatch(setProfileToEdit(profile)),
      setCurrentProfile: (profile): AnyAction => dispatch(startSetCurrentProfile(profile)),
    },
  };
}

class UCProfilesPage extends PureComponent<IProfilesPageProps> {
  private tableColumns: IColumn[] = [
    {
      title: "Name",
      sortField: "profile.name",
      defaultSortDirection: "ASC",
    },
    {
      title: "Actions",
      sortable: false,
    },
  ];

  private dataProvider = new ApiDataTableDataProvider<IProfile>(
    "/api/profiles/table-data",
    () => ({
      cacheTime: this.props.cacheTime,
    }),
    mapProfileFromApi,
  );

  constructor(props: IProfilesPageProps) {
    super(props);

    this.tableRowRenderer = this.tableRowRenderer.bind(this);
    this.generateActionButtons = this.generateActionButtons.bind(this);
    this.startProfileCreation = this.startProfileCreation.bind(this);
  }

  public render(): ReactNode {
    const { cacheTime, profileToEdit } = this.props;

    return (
      <>
        {profileToEdit !== undefined && <ProfileEditModal />}

        <div className={gs.headerWrapper}>
          <h1 className={bs.h2}>Profiles</h1>
          <div className={gs.headerExtras}>
            <KeyShortcut targetStr={"c"} onTrigger={this.startProfileCreation}>
              <IconBtn
                icon={faPlus}
                text={"New Profile"}
                onClick={this.startProfileCreation}
                btnProps={{
                  className: combine(bs.btnSm, bs.btnSuccess),
                }}
              />
            </KeyShortcut>
          </div>
        </div>

        <DataTable<IProfile>
          columns={this.tableColumns}
          dataProvider={this.dataProvider}
          rowRenderer={this.tableRowRenderer}
          watchedProps={{ cacheTime }}
        />
      </>
    );
  }

  private tableRowRenderer(profile: IProfile): ReactElement<void> {
    const activeProfile = profile.id === this.props.activeUser.activeProfile.id;
    return (
      <tr key={profile.id}>
        <td>
          {profile.name}
          {activeProfile && (
            <Badge className={bs.badgeInfo} marginLeft={true}>
              Active
            </Badge>
          )}
        </td>
        <td>{this.generateActionButtons(profile)}</td>
      </tr>
    );
  }

  private generateActionButtons(profile: IProfile): ReactElement<void> {
    const { profileSwitchInProgress, activeUser } = this.props;
    const activeProfile = profile.id === activeUser.activeProfile.id;
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={faPencil}
          text={"Edit"}
          payload={profile}
          onClick={this.props.actions.setProfileToEdit}
          btnProps={{
            className: combine(bs.btnOutlineDark, gs.btnMini),
            disabled: profileSwitchInProgress,
          }}
        />

        {!activeProfile && (
          <IconBtn
            icon={faHandPointer}
            text={"Select"}
            payload={profile}
            onClick={this.props.actions.setCurrentProfile}
            btnProps={{
              className: combine(bs.btnOutlineDark, gs.btnMini),
              disabled: profileSwitchInProgress,
            }}
          />
        )}

        {!activeProfile && (
          <DeleteBtn
            payload={profile}
            onConfirmedClick={this.props.actions.deleteProfile}
            btnProps={{
              className: combine(bs.btnOutlineDark, gs.btnMini),
              disabled: profileSwitchInProgress,
            }}
          />
        )}
      </div>
    );
  }

  private startProfileCreation(): void {
    this.props.actions.setProfileToEdit(null);
  }
}

export const ProfilesPage = connect(mapStateToProps, mapDispatchToProps)(UCProfilesPage);
