import { faPencil } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import "react-table/react-table.css";
import { ThinAccount } from "../../../../server/model-thins/ThinAccount";
import * as bs from "../../../bootstrap-aliases";
import { generateAccountTypeBadge } from "../../../helpers/formatters";
import { combine } from "../../../helpers/style-helpers";
import CheckboxBtn from "../../_ui/CheckboxBtn/CheckboxBtn";
import { DataTable } from "../../_ui/DataTable/DataTable";
import DeleteBtn from "../../_ui/DeleteBtn/DeleteBtn";
import * as appStyles from "../../App/App.scss";

interface IAccountSettingsState {
	activeOnly: boolean;
}

class AccountSettings extends Component<any, IAccountSettingsState> {

	private static generateActionButtons(account: ThinAccount) {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<button className={combine(bs.btn, bs.btnOutlineDark, appStyles.btnMini)}>
						<FontAwesomeIcon icon={faPencil} fixedWidth={true}/> Edit
					</button>
					<DeleteBtn
							btnClassNames={combine(bs.btnOutlineDark, appStyles.btnMini)}/>
				</div>
		);
	}

	constructor(props: any) {
		super(props);
		this.state = {
			activeOnly: true,
		};

		this.toggleActiveOnly = this.toggleActiveOnly.bind(this);
	}

	public render() {
		const { activeOnly } = this.state;
		return (
				<>
					<div className={appStyles.headerWrapper}>
						<h1 className={combine(bs.h2, bs.floatLeft)}>Accounts</h1>
						<div className={combine(bs.btnGroupSm, bs.floatRight)}>
							<CheckboxBtn
									initiallyChecked={true}
									onChange={this.toggleActiveOnly}
									btnClassNames={combine(bs.btnOutlineInfo, bs.btnSm)}>
								Active Accounts Only
							</CheckboxBtn>
						</div>
					</div>
					<DataTable<ThinAccount>
							api={"/settings/accounts/table-data"}
							columns={[
								{ title: "Name", sortField: "name", defaultSortDirection: "asc" },
								{ title: "Type", sortField: "type" },
								{ title: "Actions", sortable: false },
							]}
							apiExtraParams={{ activeOnly }}
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

	private toggleActiveOnly(activeOnly: boolean) {
		this.setState({ activeOnly });
	}
}

export default AccountSettings;
