import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { CacheKeyUtil } from "@dragonlabs/redux-cache-key-util";
import { IProfile, mapProfileFromApi } from "../../../models/IProfile";
import { IUser } from "../../../models/IUser";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { ProfileCacheKeys, setProfileToEdit, startDeleteProfile } from "../../redux/profiles";
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
import { getCurrentUser, setActiveProfile } from "../../api/users-and-profiles";
import { globalErrorManager } from "../../helpers/errors/error-manager";

interface IProfilesPageProps {
  readonly cacheTime: number;
  readonly profileToEdit?: IProfile;
  readonly actions?: {
    readonly deleteProfile: (profile: IProfile) => AnyAction;
    readonly setProfileToEdit: (profile: IProfile) => AnyAction;
  };
}

type ProfilesPageState = {
  readonly currentUser: IUser;
};

function mapStateToProps(state: IRootState, props: IProfilesPageProps): IProfilesPageProps {
  return {
    ...props,
    cacheTime: Math.max(CacheKeyUtil.getKeyTime(ProfileCacheKeys.PROFILE_DATA)),
    profileToEdit: state.profiles.profileToEdit,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IProfilesPageProps): IProfilesPageProps {
  return {
    ...props,
    actions: {
      deleteProfile: (profile): AnyAction => dispatch(startDeleteProfile(profile)),
      setProfileToEdit: (profile): AnyAction => dispatch(setProfileToEdit(profile)),
    },
  };
}

class UCProfilesPage extends PureComponent<IProfilesPageProps, ProfilesPageState> {
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

    this.state = {
      currentUser: null,
    };

    this.tableRowRenderer = this.tableRowRenderer.bind(this);
    this.generateActionButtons = this.generateActionButtons.bind(this);
    this.startProfileCreation = this.startProfileCreation.bind(this);
  }

  public async componentDidMount(): Promise<void> {
    try {
      const currentUser = await getCurrentUser();
      this.setState({ currentUser });
    } catch (error) {
      globalErrorManager.emitFatalError("Failed to load current user", error);
    }
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
    const { currentUser } = this.state;
    const isActiveProfile = currentUser?.activeProfile?.id == profile.id;
    return (
      <tr key={profile.id}>
        <td>
          {profile.name}
          {isActiveProfile && (
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
    const { currentUser } = this.state;
    const editsDisabled = !currentUser || currentUser.activeProfile.id == profile.id;
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={profile}
          onClick={this.props.actions.setProfileToEdit}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />

        <IconBtn
          icon={"how_to_reg"}
          text={"Select"}
          payload={profile.id}
          onClick={editsDisabled ? null : this.setActiveProfile}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: editsDisabled,
          }}
        />

        <DeleteBtn
          payload={profile}
          onConfirmedClick={editsDisabled ? null : this.props.actions.deleteProfile}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: editsDisabled,
          }}
        />
      </div>
    );
  }

  private startProfileCreation(): void {
    this.props.actions.setProfileToEdit(null);
  }

  private async setActiveProfile(profileId: string): Promise<void> {
    try {
      await setActiveProfile(profileId);
      window.location.reload();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to update the active profile", error);
    }
  }
}

export const ProfilesPage = connect(mapStateToProps, mapDispatchToProps)(UCProfilesPage);
