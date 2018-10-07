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
import { DataTable } from "../_ui/DataTable/DataTable";
import DeleteBtn from "../_ui/DeleteBtn/DeleteBtn";
import IconBtn from "../_ui/IconBtn/IconBtn";
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

	public render() {
		const { lastUpdate } = this.props;
		return (
				<>
					<h1 className={bs.h2}>Profiles</h1>

					<DataTable<ThinProfile>
							api={"/settings/profiles/table-data"}
							columns={[
								{ title: "Name", sortField: "name", defaultSortDirection: "asc" },
								{ title: "Actions", sortable: false },
							]}
							apiExtraParams={{ lastUpdate }}
							rowRenderer={(profile: ThinProfile) => (
									<tr key={profile.id}>
										<td>{profile.name}</td>
										<td>{this.generateActionButtons(profile)}</td>
									</tr>
							)}
					/>
				</>
		);
	}

	private generateActionButtons(profile: ThinProfile) {
		const deleteDisabled = profile.id === this.props.activeProfile.id;
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<IconBtn
							icon={faPencil}
							text={"Edit"}
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
							}}
					/>

					{/* TODO: tooltip showing that active account cannot be deleted */}
					<DeleteBtn
							onConfirmedClick={() => this.props.actions.deleteProfile(profile.id)}
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
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSettings);
