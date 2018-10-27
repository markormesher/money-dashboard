import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import * as bs from "../../bootstrap-aliases";
import { generateAccountTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setAccountToEdit, setDisplayActiveOnly, startDeleteAccount } from "../../redux/settings/accounts/actions";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import * as appStyles from "../App/App.scss";
import { EditAccountModal } from "./EditAccountModal";

interface IAccountSettingsProps {
	readonly lastUpdate?: number;
	readonly displayActiveOnly?: boolean;
	readonly accountToEdit?: ThinAccount;

	readonly actions?: {
		readonly deleteAccount: (id: string) => AnyAction,
		readonly setDisplayActiveOnly: (active: boolean) => AnyAction,
		readonly setAccountToEdit: (account: ThinAccount) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: IAccountSettingsProps): IAccountSettingsProps {
	return {
		...props,
		lastUpdate: state.settings.accounts.lastUpdate,
		displayActiveOnly: state.settings.accounts.displayActiveOnly,
		accountToEdit: state.settings.accounts.accountToEdit,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IAccountSettingsProps): IAccountSettingsProps {
	return {
		...props,
		actions: {
			deleteAccount: (id) => dispatch(startDeleteAccount(id)),
			setDisplayActiveOnly: (active) => dispatch(setDisplayActiveOnly(active)),
			setAccountToEdit: (account) => dispatch(setAccountToEdit(account)),
		},
	};
}

class UCAccountSettings extends PureComponent<IAccountSettingsProps> {

	private static activeOnlyStateFilter(state: IRootState) {
		return state.settings.accounts.displayActiveOnly;
	}

	private tableColumns: IColumn[] = [
		{ title: "Name", sortField: "name", defaultSortDirection: "asc" },
		{ title: "Type", sortField: "type" },
		{ title: "Actions", sortable: false },
	];

	constructor(props: IAccountSettingsProps) {
		super(props);

		this.tableRowRenderer = this.tableRowRenderer.bind(this);
		this.generateActionButtons = this.generateActionButtons.bind(this);
		this.startAccountCreation = this.startAccountCreation.bind(this);
	}

	public render() {
		const { lastUpdate, displayActiveOnly, accountToEdit } = this.props;
		return (
				<>
					{accountToEdit !== undefined && <EditAccountModal/>}

					<div className={appStyles.headerWrapper}>
						<h1 className={combine(bs.h2, bs.floatLeft)}>Accounts</h1>
						<div className={combine(bs.btnGroup, bs.floatRight)}>
							<CheckboxBtn
									text={"Active Accounts Only"}
									stateFilter={UCAccountSettings.activeOnlyStateFilter}
									stateModifier={this.props.actions.setDisplayActiveOnly}
									btnProps={{
										className: combine(bs.btnOutlineInfo, bs.btnSm),
									}}
							/>

							<IconBtn
									icon={faPlus}
									text={"New Account"}
									onClick={this.startAccountCreation}
									btnProps={{
										className: combine(bs.btnSm, bs.btnSuccess),
									}}
							/>
						</div>
					</div>

					<DataTable<ThinAccount>
							api={"/settings/accounts/table-data"}
							columns={this.tableColumns}
							rowRenderer={this.tableRowRenderer}
							apiExtraParams={{
								activeOnly: displayActiveOnly,
								lastUpdate,
							}}
					/>
				</>
		);
	}

	private tableRowRenderer(account: ThinAccount) {
		return (
				<tr key={account.id}>
					<td>{account.name}</td>
					<td>{generateAccountTypeBadge(account)}</td>
					<td>{this.generateActionButtons(account)}</td>
				</tr>
		);
	}

	private generateActionButtons(account: ThinAccount) {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<IconBtn
							icon={faPencil}
							text={"Edit"}
							payload={account}
							onClick={this.props.actions.setAccountToEdit}
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
							}}
					/>

					<DeleteBtn
							payload={account.id}
							onConfirmedClick={this.props.actions.deleteAccount}
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
							}}
					/>
				</div>
		);
	}

	private startAccountCreation() {
		this.props.actions.setAccountToEdit(null);
	}
}

export const AccountSettings = connect(mapStateToProps, mapDispatchToProps)(UCAccountSettings);
