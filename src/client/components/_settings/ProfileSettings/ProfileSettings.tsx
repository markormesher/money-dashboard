import { faPencil, faShare, faShareAlt, faTrash } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component, ReactNode } from "react";
import { ThinProfile } from "../../../../server/model-thins/ThinProfile";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import * as appStyles from "../../App/App.scss";
import { DataTable } from "../../DataTable/DataTable";

class ProfileSettings extends Component {

	private static generateActionButtons(profile: ThinProfile) {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faPencil} fixedWidth={true}/> Edit
					</button>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faTrash} fixedWidth={true}/> Delete
					</button>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faShareAlt} fixedWidth={true}/> Share
					</button>
				</div>
		);
	}

	public render() {
		return (
				<>
					<h1 className={bs.h2}>Profiles</h1>
					<DataTable<ThinProfile>
							api={"/settings/profiles/table-data"}
							columns={[
								{ title: "Name", sortField: "name", defaultSortDirection: "asc" },
								{ title: "Actions", sortable: false },
							]}
							rowRenderer={(profile: ThinProfile) => (
									<tr key={profile.id}>
										<td>{profile.name}</td>
										<td>{ProfileSettings.generateActionButtons(profile)}</td>
									</tr>
							)}
					/>
				</>
		);
	}
}

export default ProfileSettings;
