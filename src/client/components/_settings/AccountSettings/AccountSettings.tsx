import { faPencil, faTrash } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import "react-table/react-table.css";
import { Dispatch } from "redux";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import * as bs from "../../../bootstrap-aliases";
import { generateAccountTypeBadge } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";
import { IRootState } from "../../../redux/root";
import * as appStyles from "../../App/App.scss";
import { DataTable } from "../../DataTable/DataTable";

interface IAccountSettingsProps {

}

function mapStateToProps(state: IRootState, props: IAccountSettingsProps): IAccountSettingsProps {
	return {
		...props,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IAccountSettingsProps): IAccountSettingsProps {
	return {
		...props,
	};
}

class AccountSettings extends Component<IAccountSettingsProps> {

	private static generateActionButtons(account: ThinAccount) {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faPencil} fixedWidth={true}/>
					</button>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faTrash} fixedWidth={true}/>
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
										<td>{generateAccountTypeBadge(account.type)}</td>
										<td>{AccountSettings.generateActionButtons(account)}</td>
									</tr>
							)}
					/>
				</>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
