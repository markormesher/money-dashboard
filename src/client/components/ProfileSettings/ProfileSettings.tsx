import { faPencil, faUserPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinProfile } from "../../../server/model-thins/ThinProfile";
import * as bs from "../../bootstrap-aliases";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { startDeleteProfile } from "../../redux/settings/profiles/actions";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import DeleteBtn from "../_ui/DeleteBtn/DeleteBtn";
import IconBtn from "../_ui/IconBtn/IconBtn";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import * as appStyles from "../App/App.scss";

interface IProfileSettingsProps {
	lastUpdate: number;
	activeProfile?: ThinProfile;
	actions?: {
		deleteProfile: (id: string) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: IProfileSettingsProps): IProfileSettingsProps {
	return {
		...props,
		lastUpdate: state.settings.accounts.lastUpdate,
		activeProfile: state.auth.activeUser.profiles[state.auth.activeProfile],
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IProfileSettingsProps): IProfileSettingsProps {
	return {
		...props,
		actions: {
			deleteProfile: (id) => dispatch(startDeleteProfile(id)),
		},
	};
}

class ProfileSettings extends Component<IProfileSettingsProps> {

	private tableColumns: IColumn[] = [
		{ title: "Name", sortField: "name", defaultSortDirection: "asc" },
		{ title: "Actions", sortable: false },
	];

	constructor(props: IProfileSettingsProps) {
		super(props);
		this.tableRowRenderer = this.tableRowRenderer.bind(this);
		this.generateActionButtons = this.generateActionButtons.bind(this);
	}

	public render() {
		const { lastUpdate } = this.props;
		return (
				<>
					<h1 className={bs.h2}>Profiles</h1>

					<DataTable<ThinProfile>
							api={"/settings/profiles/table-data"}
							columns={this.tableColumns}
							rowRenderer={this.tableRowRenderer}
							apiExtraParams={{ lastUpdate }}
					/>
				</>
		);
	}

	private tableRowRenderer(profile: ThinProfile) {
		return (
				<tr key={profile.id}>
					<td>{profile.name}</td>
					<td>{this.generateActionButtons(profile)}</td>
				</tr>
		);
	}

	private generateActionButtons(profile: ThinProfile) {
		const deleteDisabled = profile.id === this.props.activeProfile.id;
		return (
				<>
					<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
						<IconBtn
								icon={faPencil}
								text={"Edit"}
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

						<IconBtn
								icon={faUserPlus}
								text={"Share"}
								btnProps={{
									className: combine(bs.btnOutlineDark, appStyles.btnMini),
								}}
						/>
					</div>
					{deleteDisabled && <> <InfoIcon hoverText={"Your active profile cannot be deleted"}/></>}
				</>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
