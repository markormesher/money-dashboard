import * as React from "react";
import { ReactElement, useEffect, useState } from "react";
import { DEFAULT_PROFILE, IProfile, mapProfileFromApi } from "../../../models/IProfile";
import { IUser } from "../../../models/IUser";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { Badge } from "../_ui/Badge/Badge";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { ProfileEditModal } from "../ProfileEditModal/ProfileEditModal";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { Card } from "../_ui/Card/Card";
import { UserApi, ProfileApi } from "../../api/users-and-profiles";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { useNonceState } from "../../helpers/state-hooks";

function ProfilesPage(): ReactElement {
  // state
  const [nonce, updateNonce] = useNonceState();
  const [currentUser, setCurrentUser] = useState<IUser>(null);
  const [profileToEdit, setProfileToEdit] = useState<IProfile>(null);

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await UserApi.getCurrentUser();
        setCurrentUser(currentUser);
      } catch (error) {
        globalErrorManager.emitFatalError("Failed to load current user", error);
      }
    })();
  }, []);

  // data table
  const tableColumns: IColumn[] = [
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

  const dataProvider = new ApiDataTableDataProvider<IProfile>(
    "/api/profiles/table-data",
    () => ({ nonce }),
    mapProfileFromApi,
  );

  function tableRowRenderer(profile: IProfile): ReactElement<void> {
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
        <td>{generateActionButtons(profile)}</td>
      </tr>
    );
  }

  function generateActionButtons(profile: IProfile): ReactElement<void> {
    const editsDisabled = !currentUser || currentUser.activeProfile.id == profile.id;
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={profile}
          onClick={editProfile}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />

        <IconBtn
          icon={"how_to_reg"}
          text={"Select"}
          payload={profile.id}
          onClick={editsDisabled ? null : setActiveProfile}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: editsDisabled,
          }}
        />

        <DeleteBtn
          payload={profile}
          onConfirmedClick={editsDisabled ? null : deleteProfile}
          btnProps={{
            className: bs.btnOutlineDark,
            disabled: editsDisabled,
          }}
        />
      </div>
    );
  }

  // profile actions
  function createProfile(): void {
    setProfileToEdit(DEFAULT_PROFILE);
  }

  function editProfile(profile: IProfile): void {
    setProfileToEdit(profile);
  }

  function onEditCancel(): void {
    setProfileToEdit(null);
  }

  function onEditComplete(): void {
    setProfileToEdit(null);
    updateNonce();
  }

  async function deleteProfile(profile: IProfile): Promise<void> {
    try {
      await ProfileApi.deleteProfile(profile);
      updateNonce();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to delete profile", error);
    }
  }

  async function setActiveProfile(profileId: string): Promise<void> {
    try {
      await ProfileApi.setActiveProfile(profileId);
      window.location.reload();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to update the active profile", error);
    }
  }

  return (
    <>
      {profileToEdit ? (
        <ProfileEditModal profileToEdit={profileToEdit} onCancel={onEditCancel} onComplete={onEditComplete} />
      ) : null}

      <PageHeader>
        <h2>Profiles</h2>
        <PageHeaderActions>
          <KeyShortcut targetStr={"c"} onTrigger={createProfile}>
            <IconBtn
              icon={"add"}
              text={"New Profile"}
              onClick={createProfile}
              btnProps={{
                className: combine(bs.btnSm, bs.btnSuccess),
              }}
            />
          </KeyShortcut>
        </PageHeaderActions>
      </PageHeader>

      <Card>
        <DataTable<IProfile>
          columns={tableColumns}
          dataProvider={dataProvider}
          rowRenderer={tableRowRenderer}
          watchedProps={{ nonce }}
        />
      </Card>
    </>
  );
}

export { ProfilesPage };
