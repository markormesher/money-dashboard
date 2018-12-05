import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IAccount, mapAccountFromApi } from "../../../server/models/IAccount";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { generateAccountTypeBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { AccountCacheKeys, setAccountToEdit, setDisplayActiveOnly, startDeleteAccount } from "../../redux/accounts";
import { KeyCache } from "../../redux/helpers/KeyCache";
import { IRootState } from "../../redux/root";
import { CheckboxBtn } from "../_ui/CheckboxBtn/CheckboxBtn";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { AccountEditModal } from "../AccountEditModal/AccountEditModal";

interface IAccountsPageProps {
	readonly cacheTime: number;
	readonly displayActiveOnly?: boolean;
	readonly accountToEdit?: IAccount;

	readonly actions?: {
		readonly deleteAccount: (id: string) => AnyAction,
		readonly setDisplayActiveOnly: (active: boolean) => AnyAction,
		readonly setAccountToEdit: (account: IAccount) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: IAccountsPageProps): IAccountsPageProps {
	return {
		...props,
		cacheTime: KeyCache.getKeyTime(AccountCacheKeys.ACCOUNT_DATA),
		displayActiveOnly: state.accounts.displayActiveOnly,
		accountToEdit: state.accounts.accountToEdit,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IAccountsPageProps): IAccountsPageProps {
	return {
		...props,
		actions: {
			deleteAccount: (id) => dispatch(startDeleteAccount(id)),
			setDisplayActiveOnly: (active) => dispatch(setDisplayActiveOnly(active)),
			setAccountToEdit: (account) => dispatch(setAccountToEdit(account)),
		},
	};
}

class UCAccountsPage extends PureComponent<IAccountsPageProps> {

	private tableColumns: IColumn[] = [
		{
			title: "Name",
			sortField: "account.name",
			defaultSortDirection: "ASC",
		},
		{
			title: "Type",
			sortField: "account.type",
		},
		{
			title: "Actions",
			sortable: false,
		},
	];

	private dataProvider = new ApiDataTableDataProvider<IAccount>(
			"/accounts/table-data",
			() => ({
				cacheTime: this.props.cacheTime,
				activeOnly: this.props.displayActiveOnly,
			}),
			mapAccountFromApi,
	);

	constructor(props: IAccountsPageProps) {
		super(props);

		this.tableRowRenderer = this.tableRowRenderer.bind(this);
		this.generateActionButtons = this.generateActionButtons.bind(this);
		this.startAccountCreation = this.startAccountCreation.bind(this);
	}

	public render(): ReactNode {
		const { cacheTime, displayActiveOnly, accountToEdit } = this.props;

		return (
				<>
					{accountToEdit !== undefined && <AccountEditModal/>}

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

					<DataTable<IAccount>
							columns={this.tableColumns}
							dataProvider={this.dataProvider}
							rowRenderer={this.tableRowRenderer}
							watchedProps={{ cacheTime, displayActiveOnly }}
					/>
				</>
		);
	}

	private tableRowRenderer(account: IAccount): ReactElement<void> {
		return (
				<tr key={account.id}>
					<td>{account.name}</td>
					<td>{generateAccountTypeBadge(account)}</td>
					<td>{this.generateActionButtons(account)}</td>
				</tr>
		);
	}

	private generateActionButtons(account: IAccount): ReactElement<void> {
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

export const AccountsPage = connect(mapStateToProps, mapDispatchToProps)(UCAccountsPage);
