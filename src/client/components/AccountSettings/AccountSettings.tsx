import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import { PureComponent, ReactElement, ReactNode } from "react";
import * as React from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { generateAccountTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { setAccountToEdit, setDisplayActiveOnly, startDeleteAccount } from "../../redux/accounts";
import { KeyCache } from "../../redux/helpers/KeyCache";
import { IRootState } from "../../redux/root";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { EditAccountModal } from "./EditAccountModal";

interface IAccountSettingsProps {
	readonly cacheTime: number;
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
		cacheTime: KeyCache.getKeyTime("accounts"),
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

	private tableColumns: IColumn[] = [
		{ title: "Name", sortField: "name", defaultSortDirection: "asc" },
		{ title: "Type", sortField: "type" },
		{ title: "Actions", sortable: false },
	];

	private dataProvider = new ApiDataTableDataProvider<ThinAccount>("/settings/accounts/table-data", () => ({
		cacheTime: this.props.cacheTime,
		activeOnly: this.props.displayActiveOnly,
	}));

	constructor(props: IAccountSettingsProps) {
		super(props);

		this.tableRowRenderer = this.tableRowRenderer.bind(this);
		this.generateActionButtons = this.generateActionButtons.bind(this);
		this.startAccountCreation = this.startAccountCreation.bind(this);
	}

	public render(): ReactNode {
		const { cacheTime, displayActiveOnly, accountToEdit } = this.props;

		return (
				<>
					{accountToEdit !== undefined && <EditAccountModal/>}

					<div className={gs.headerWrapper}>
						<h1 className={bs.h2}>Accounts</h1>
						<div className={combine(bs.btnGroup, gs.headerExtras)}>
							<CheckboxBtn
									text={"Active Accounts Only"}
									checked={this.props.displayActiveOnly}
									onChange={this.props.actions.setDisplayActiveOnly}
									btnProps={{
										className: combine(bs.btnOutlineInfo, bs.btnSm),
									}}
							/>

							<KeyShortcut
									targetStr={"c"}
									onTrigger={this.startAccountCreation}
							>
								<IconBtn
										icon={faPlus}
										text={"New Account"}
										onClick={this.startAccountCreation}
										btnProps={{
											className: combine(bs.btnSm, bs.btnSuccess),
										}}
								/>
							</KeyShortcut>
						</div>
					</div>

					<DataTable<ThinAccount>
							columns={this.tableColumns}
							dataProvider={this.dataProvider}
							rowRenderer={this.tableRowRenderer}
							watchedProps={{ cacheTime, displayActiveOnly }}
					/>
				</>
		);
	}

	private tableRowRenderer(account: ThinAccount): ReactElement<void> {
		return (
				<tr key={account.id}>
					<td>{account.name}</td>
					<td>{generateAccountTypeBadge(account)}</td>
					<td>{this.generateActionButtons(account)}</td>
				</tr>
		);
	}

	private generateActionButtons(account: ThinAccount): ReactElement<void> {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<IconBtn
							icon={faPencil}
							text={"Edit"}
							payload={account}
							onClick={this.props.actions.setAccountToEdit}
							btnProps={{
								className: combine(bs.btnOutlineDark, gs.btnMini),
							}}
					/>

					<DeleteBtn
							payload={account.id}
							onConfirmedClick={this.props.actions.deleteAccount}
							btnProps={{
								className: combine(bs.btnOutlineDark, gs.btnMini),
							}}
					/>
				</div>
		);
	}

	private startAccountCreation(): void {
		this.props.actions.setAccountToEdit(null);
	}
}

export const AccountSettings = connect(mapStateToProps, mapDispatchToProps)(UCAccountSettings);
