import * as React from "react";
import { Component, ReactNode } from "react";
import { connect } from "react-redux";
import "react-table/react-table.css";
import { Dispatch } from "redux";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import * as bs from "../../../bootstrap-aliases";
import { formatAccountType } from "../../../helpers/formatters";
import { capitaliseFirst } from "../../../helpers/string-helpers";
import { combine } from "../../../helpers/style-helpers";
import { IRootState } from "../../../redux/root";
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

	public render() {
		return (
				<>
					<h1 className={bs.h2}>Accounts</h1>
					<DataTable<ThinAccount>
							api={"/settings/accounts/table-data"}
							columns={[
								{ title: "Name", sortField: "name", defaultSortDirection: "asc" },
								{ title: "Type", sortField: "type" },
								{ title: "Accounts", sortable: false },
							]}
							rowRenderer={(account: ThinAccount) => (
									<tr key={account.id}>
										<td>{account.name}</td>
										<td>{formatAccountType(account.type)}</td>
										<td>TODO: actions</td>
									</tr>
							)}
					/>
				</>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
