import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import { PureComponent, ReactElement, ReactNode } from "react";
import * as React from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinProfile } from "../../../server/model-thins/ThinProfile";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { combine } from "../../helpers/style-helpers";
import { KeyCache } from "../../redux/helpers/KeyCache";
import { setProfileToEdit, startDeleteProfile } from "../../redux/profiles";
import { IRootState } from "../../redux/root";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { EditProfileModal } from "./EditProfileModal";

interface IProfileSettingsProps {
	readonly cacheTime: number;
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
		cacheTime: KeyCache.getKeyTime("profiles"),
		profileToEdit: state.profiles.profileToEdit,
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

	private dataProvider = new ApiDataTableDataProvider<ThinProfile>("/settings/profiles/table-data", () => ({
		cacheTime: this.props.cacheTime,
	}));

	constructor(props: IProfileSettingsProps) {
		super(props);

		this.tableRowRenderer = this.tableRowRenderer.bind(this);
		this.generateActionButtons = this.generateActionButtons.bind(this);
		this.startProfileCreation = this.startProfileCreation.bind(this);
	}

	public render(): ReactNode {
		const { cacheTime, profileToEdit } = this.props;

		return (
				<>
					{profileToEdit !== undefined && <EditProfileModal/>}

					<div className={gs.headerWrapper}>
						<h1 className={bs.h2}>Profiles</h1>
						<div className={gs.headerExtras}>
							<KeyShortcut
									targetStr={"c"}
									onTrigger={this.startProfileCreation}
							>
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

					<DataTable<ThinProfile>
							columns={this.tableColumns}
							dataProvider={this.dataProvider}
							rowRenderer={this.tableRowRenderer}
							watchedProps={{ cacheTime }}
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
									className: combine(bs.btnOutlineDark, gs.btnMini),
								}}
						/>

						<DeleteBtn
								payload={profile.id}
								onConfirmedClick={this.props.actions.deleteProfile}
								btnProps={{
									className: combine(bs.btnOutlineDark, gs.btnMini),
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
