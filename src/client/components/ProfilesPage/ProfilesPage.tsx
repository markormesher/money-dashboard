import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { IProfile, mapProfileFromApi } from "../../../models/IProfile";
import { IUser } from "../../../models/IUser";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { ProfileCacheKeys, setProfileToEdit, startDeleteProfile, startSetActiveProfile } from "../../redux/profiles";
import { IRootState } from "../../redux/root";
import { Badge } from "../_ui/Badge/Badge";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { ProfileEditModal } from "../ProfileEditModal/ProfileEditModal";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { Card } from "../_ui/Card/Card";

interface IProfilesPageProps {
  readonly cacheTime: number;
  readonly profileToEdit?: IProfile;
  readonly profileSwitchInProgress: boolean;
  readonly activeUser?: IUser;
  readonly actions?: {
    readonly deleteProfile: (profile: IProfile) => AnyAction;
    readonly setProfileToEdit: (profile: IProfile) => AnyAction;
    readonly startSetActiveProfile: (profile: IProfile) => AnyAction;
  };
}

function mapStateToProps(state: IRootState, props: IProfilesPageProps): IProfilesPageProps {
  return {
    ...props,
    cacheTime: Math.max(
      CacheKeyUtil.getKeyTime(ProfileCacheKeys.PROFILE_DATA),
      CacheKeyUtil.getKeyTime(ProfileCacheKeys.ACTIVE_PROFILE),
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
      startSetActiveProfile: (profile): AnyAction => dispatch(startSetActiveProfile(profile)),
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

        <PageHeader>
          <h2>Profiles</h2>
          <PageHeaderActions>
            <KeyShortcut targetStr={"c"} onTrigger={this.startProfileCreation}>
              <IconBtn
                icon={"add"}
                text={"New Profile"}
                onClick={this.startProfileCreation}
                btnProps={{
                  className: combine(bs.btnSm, bs.btnSuccess),
                }}
              />
            </KeyShortcut>
          </PageHeaderActions>
        </PageHeader>

        <Card>
          <DataTable<IProfile>
            columns={this.tableColumns}
            dataProvider={this.dataProvider}
            rowRenderer={this.tableRowRenderer}
            watchedProps={{ cacheTime }}
          />
        </Card>
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
            <Badge className={bs.bgInfo} marginLeft={true}>
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
          icon={"edit"}
          text={"Edit"}
          payload={profile}
          onClick={this.props.actions.setProfileToEdit}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: profileSwitchInProgress,
          }}
        />

        {!activeProfile && (
          <IconBtn
            icon={"how_to_reg"}
            text={"Select"}
            payload={profile}
            onClick={this.props.actions.startSetActiveProfile}
            btnProps={{
              className: bs.btnOutlineDark,
              disabled: profileSwitchInProgress,
            }}
          />
        )}

        {!activeProfile && (
          <DeleteBtn
            payload={profile}
            onConfirmedClick={this.props.actions.deleteProfile}
            btnProps={{
              className: bs.btnOutlineDark,
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
