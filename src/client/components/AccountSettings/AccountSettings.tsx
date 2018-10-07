import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import * as bs from "../../bootstrap-aliases";
import { generateAccountTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setAccountToEdit, setDisplayActiveOnly, startDeleteAccount } from "../../redux/settings/accounts/actions";
import CheckboxBtn from "../_ui/CheckboxBtn/CheckboxBtn";
import { DataTable } from "../_ui/DataTable/DataTable";
import DeleteBtn from "../_ui/DeleteBtn/DeleteBtn";
import IconBtn from "../_ui/IconBtn/IconBtn";
import * as appStyles from "../App/App.scss";
import EditAccountModal from "./EditAccountModal";

interface IAccountSettingsProps {
	lastUpdate: number;
	displayActiveOnly: boolean;
	accountToEdit: ThinAccount;

	actions?: {
		deleteAccount: (id: string) => AnyAction,
		setDisplayActiveOnly: (active: boolean) => AnyAction,
		setAccountToEdit: (account: ThinAccount) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: IAccountSettingsProps): IAccountSettingsProps {
	return {
		...props,
		...state.settings.accounts,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IAccountSettingsProps): IAccountSettingsProps {
	return {
		...props,
		actions: {
			deleteAccount: (id: string) => dispatch(startDeleteAccount(id)),
			setDisplayActiveOnly: (active: boolean) => dispatch(setDisplayActiveOnly(active)),
			setAccountToEdit: (account: ThinAccount) => dispatch(setAccountToEdit(account)),
		},
	};
}

class AccountSettings extends Component<IAccountSettingsProps> {

	public render() {
		const { lastUpdate, displayActiveOnly, accountToEdit } = this.props;
		return (
				<>
					<EditAccountModal
							account={accountToEdit}
							isOpen={accountToEdit !== undefined}
							onCloseRequest={() => this.props.actions.setAccountToEdit(undefined)}
					/>

					<div className={appStyles.headerWrapper}>
						<h1 className={combine(bs.h2, bs.floatLeft)}>Accounts</h1>
						<div className={combine(bs.btnGroup, bs.floatRight)}>
							<CheckboxBtn
									text={"Active Accounts Only"}
									stateFilter={(state) => state.settings.accounts.displayActiveOnly}
									stateModifier={this.props.actions.setDisplayActiveOnly}
									btnProps={{
										className: combine(bs.btnOutlineInfo, bs.btnSm),
									}}/>

							<IconBtn
									icon={faPlus}
									text={"New Account"}
									btnProps={{
										className: combine(bs.btnSm, bs.btnSuccess),
									}}/>
						</div>
					</div>

					<DataTable<ThinAccount>
							api={"/settings/accounts/table-data"}
							columns={[
								{ title: "Name", sortField: "name", defaultSortDirection: "asc" },
								{ title: "Type", sortField: "type" },
								{ title: "Actions", sortable: false },
							]}
							apiExtraParams={{
								activeOnly: displayActiveOnly,
								lastUpdate,
							}}
							rowRenderer={(account: ThinAccount) => (
									<tr key={account.id}>
										<td>{account.name}</td>
										<td>{generateAccountTypeBadge(account)}</td>
										<td>{this.generateActionButtons(account)}</td>
									</tr>
							)}
					/>
				</>
		);
	}

	private generateActionButtons(account: ThinAccount) {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<IconBtn
							icon={faPencil}
							text={"Edit"}
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
								onClick: () => this.props.actions.setAccountToEdit(account),
							}}/>

					<DeleteBtn
							onConfirmedClick={() => this.props.actions.deleteAccount(account.id)}
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
							}}/>
				</div>
		);
	}

}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);
