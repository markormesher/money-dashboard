import { faPencil, faTrash } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import "react-table/react-table.css";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import * as bs from "../../../bootstrap-aliases";
import { generateAccountTypeBadge } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";
import { DataTable } from "../../_ui/DataTable/DataTable";
import * as appStyles from "../../App/App.scss";

class AccountSettings extends Component {

	private static generateActionButtons(account: ThinAccount) {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faPencil} fixedWidth={true}/> Edit
					</button>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faTrash} fixedWidth={true}/> Delete
					</button>
				</div>
		);
	}

	public render() {
		return (
				<>
					<h1 className={bs.h2}>Accounts</h1>
					<DataTable<ThinAccount>
							api={"/settings/accounts/table-data"}
							columns={[
								{ title: "Name", sortField: "name", defaultSortDirection: "asc" },
								{ title: "Type", sortField: "type" },
								{ title: "Actions", sortable: false },
							]}
							rowRenderer={(account: ThinAccount) => (
									<tr key={account.id}>
										<td>{account.name}</td>
										<td>{generateAccountTypeBadge(account)}</td>
										<td>{AccountSettings.generateActionButtons(account)}</td>
									</tr>
							)}
					/>
				</>
		);
	}
}

export default AccountSettings;
