import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import { ReactElement, ReactNode } from "react";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinProfile } from "../../../server/model-thins/ThinProfile";
import * as bs from "../../bootstrap-aliases";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setProfileToEdit, startDeleteProfile } from "../../redux/settings/profiles/actions";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import * as appStyles from "../App/App.scss";
import { EditProfileModal } from "./EditProfileModal";

interface IProfileSettingsProps {
	readonly lastUpdate: number;
	readonly profileToEdit?: ThinProfile;
	readonly activeProfile?: ThinProfile;
	readonly actions?: {
		readonly deleteProfile: (id: string) => AnyAction,
		readonly setProfileToEdit: (profile: ThinProfile) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: IProfileSettingsProps): IProfileSettingsProps {
	return {
		...props,
		lastUpdate: state.settings.profiles.lastUpdate,
		profileToEdit: state.settings.profiles.profileToEdit,
		activeProfile: state.auth.activeUser.profiles[state.auth.activeProfile],
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IProfileSettingsProps): IProfileSettingsProps {
	return {
		...props,
		actions: {
			deleteProfile: (id) => dispatch(startDeleteProfile(id)),
			setProfileToEdit: (profile) => dispatch(setProfileToEdit(profile)),
		},
	};
}

class UCProfileSettings extends PureComponent<IProfileSettingsProps> {

	private tableColumns: IColumn[] = [
		{ title: "Name", sortField: "name", defaultSortDirection: "asc" },
		{ title: "Actions", sortable: false },
	];

	constructor(props: IProfileSettingsProps) {
		super(props);

		this.tableRowRenderer = this.tableRowRenderer.bind(this);
		this.generateActionButtons = this.generateActionButtons.bind(this);
		this.startProfileCreation = this.startProfileCreation.bind(this);
	}

	public render(): ReactNode {
		const { lastUpdate, profileToEdit } = this.props;
		return (
				<>
					{profileToEdit !== undefined && <EditProfileModal/>}

					<div className={appStyles.headerWrapper}>
						<h1 className={combine(bs.h2, bs.floatLeft)}>Profiles</h1>

						<IconBtn
								icon={faPlus}
								text={"New Profile"}
								onClick={this.startProfileCreation}
								btnProps={{
									className: combine(bs.floatRight, bs.btnSm, bs.btnSuccess),
								}}
						/>
					</div>

					<DataTable<ThinProfile>
							api={"/settings/profiles/table-data"}
							columns={this.tableColumns}
							rowRenderer={this.tableRowRenderer}
							apiExtraParams={{ lastUpdate }}
					/>
				</>
		);
	}

	private tableRowRenderer(profile: ThinProfile): ReactElement<void> {
		return (
				<tr key={profile.id}>
					<td>{profile.name}</td>
					<td>{this.generateActionButtons(profile)}</td>
				</tr>
		);
	}

	private generateActionButtons(profile: ThinProfile): ReactElement<void> {
		const deleteDisabled = profile.id === this.props.activeProfile.id;
		return (
				<>
					<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
						<IconBtn
								icon={faPencil}
								text={"Edit"}
								payload={profile}
								onClick={this.props.actions.setProfileToEdit}
								btnProps={{
									className: combine(bs.btnOutlineDark, appStyles.btnMini),
								}}
						/>

						<DeleteBtn
								payload={profile.id}
								onConfirmedClick={this.props.actions.deleteProfile}
								btnProps={{
									className: combine(bs.btnOutlineDark, appStyles.btnMini),
									disabled: deleteDisabled,
								}}
						/>
					</div>
					{deleteDisabled && <> <InfoIcon hoverText={"Your active profile cannot be deleted"}/></>}
				</>
		);
	}

	private startProfileCreation(): void {
		this.props.actions.setProfileToEdit(null);
	}
}

export const ProfileSettings = connect(mapStateToProps, mapDispatchToProps)(UCProfileSettings);
