import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import "react-table/react-table.css";
import { Dispatch } from "redux";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import * as bs from "../../../bootstrap-aliases";
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
							rowRenderer={(r: ThinAccount, idx: number) => (
									<tr key={idx}>
										<td>{r.name}</td>
										<td>{r.type}</td>
										<td>TODO: actions</td>
									</tr>
							)}
					/>
				</>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
