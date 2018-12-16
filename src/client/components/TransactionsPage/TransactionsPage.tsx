import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { DateModeOption, ITransaction, mapTransactionFromApi } from "../../../server/models/ITransaction";
import * as bs from "../../global-styles/Bootstrap.scss";
import * as gs from "../../global-styles/Global.scss";
import { formatCurrencyStyled, formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { KeyCache } from "../../redux/helpers/KeyCache";
import { IRootState } from "../../redux/root";
import {
	setDateMode,
	setTransactionToEdit,
	startDeleteTransaction,
	TransactionCacheKeys,
} from "../../redux/transactions";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { TransactionEditModal } from "../TransactionEditModal/TransactionEditModal";

interface ITransactionPageProps {
	readonly cacheTime: number;
	readonly dateMode: DateModeOption;
	readonly transactionToEdit?: ITransaction;
	readonly actions?: {
		readonly deleteTransaction: (transaction: ITransaction) => AnyAction,
		readonly setDateMode: (mode: DateModeOption) => AnyAction,
		readonly setTransactionToEdit: (transaction: ITransaction) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: ITransactionPageProps): ITransactionPageProps {
	return {
		...props,
		cacheTime: KeyCache.getKeyTime(TransactionCacheKeys.TRANSACTION_DATA),
		dateMode: state.transactions.dateMode,
		transactionToEdit: state.transactions.transactionToEdit,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: ITransactionPageProps): ITransactionPageProps {
	return {
		...props,
		actions: {
			deleteTransaction: (transaction) => dispatch(startDeleteTransaction(transaction)),
			setDateMode: (active) => dispatch(setDateMode(active)),
			setTransactionToEdit: (transaction) => dispatch(setTransactionToEdit(transaction)),
		},
	};
}

class UCTransactionsPage extends PureComponent<ITransactionPageProps> {

	private tableColumns: IColumn[] = [
		{
			title: "Date",
			sortField: "__date__", // this is swapped for effective/transaction date on the server side
			defaultSortDirection: "DESC",
			defaultSortPriority: 0,
		},
		{
			title: "Account",
			sortField: "account.name",
		},
		{
			title: "Payee",
			sortField: "transaction.payee",
		},
		{
			title: "Amount",
			sortField: "transaction.amount",
		},
		{
			title: "Category",
			sortField: "category.name",
		},
		{
			title: "Actions",
			sortable: false,
		},
	];

	private dataProvider = new ApiDataTableDataProvider<ITransaction>(
			"/transactions/table-data",
			() => ({
				cacheTime: this.props.cacheTime,
				dateMode: this.props.dateMode,
			}),
			mapTransactionFromApi,
	);

	constructor(props: ITransactionPageProps) {
		super(props);

		this.tableRowRenderer = this.tableRowRenderer.bind(this);
		this.generateActionButtons = this.generateActionButtons.bind(this);
		this.startTransactionCreation = this.startTransactionCreation.bind(this);
	}

	public render(): ReactNode {
		const { cacheTime, dateMode, transactionToEdit } = this.props;

		return (
				<>
					{transactionToEdit !== undefined && <TransactionEditModal/>}

					<div className={gs.headerWrapper}>
						<h1 className={bs.h2}>Transactions</h1>
						<div className={combine(bs.btnGroup, gs.headerExtras)}>
							<DateModeToggleBtn
									value={this.props.dateMode}
									onChange={this.props.actions.setDateMode}
									btnProps={{
										className: combine(bs.btnOutlineInfo, bs.btnSm),
									}}
							/>

							<KeyShortcut
									targetStr={"c"}
									onTrigger={this.startTransactionCreation}
							>
								<IconBtn
										icon={faPlus}
										text={"New Transaction"}
										onClick={this.startTransactionCreation}
										btnProps={{
											className: combine(bs.btnSm, bs.btnSuccess),
										}}
								/>
							</KeyShortcut>
						</div>
					</div>

					<DataTable<ITransaction>
							columns={this.tableColumns}
							dataProvider={this.dataProvider}
							watchedProps={{ cacheTime, dateMode }}
							rowRenderer={this.tableRowRenderer}
					/>
				</>
		);
	}

	private tableRowRenderer(transaction: ITransaction): ReactElement<void> {
		const { dateMode } = this.props;
		const mainDate = formatDate(dateMode === "effective" ? transaction.effectiveDate : transaction.transactionDate);
		const altDate = formatDate(dateMode === "effective" ? transaction.transactionDate : transaction.effectiveDate);
		return (
				<tr key={transaction.id}>
					<td>
						{mainDate}
						{mainDate !== altDate && <> <InfoIcon hoverText={altDate}/></>}
					</td>
					<td>{transaction.account.name}</td>
					<td>
						{transaction.payee}
						{transaction.note && <> <InfoIcon hoverText={transaction.note}/></>}
					</td>
					<td>{formatCurrencyStyled(transaction.amount)}</td>
					<td>{transaction.category.name}</td>
					<td>{this.generateActionButtons(transaction)}</td>
				</tr>
		);
	}

	private generateActionButtons(transaction: ITransaction): ReactElement<void> {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<IconBtn
							icon={faPencil}
							text={"Edit"}
							payload={transaction}
							onClick={this.props.actions.setTransactionToEdit}
							btnProps={{
								className: combine(bs.btnOutlineDark, gs.btnMini),
								disabled: transaction.account.deleted || transaction.category.deleted,
							}}
					/>
					<DeleteBtn
							payload={transaction}
							onConfirmedClick={this.props.actions.deleteTransaction}
							btnProps={{
								className: combine(bs.btnOutlineDark, gs.btnMini),
							}}
					/>
				</div>
		);
	}

	private startTransactionCreation(): void {
		this.props.actions.setTransactionToEdit(null);
	}
}

export const TransactionsPage = connect(mapStateToProps, mapDispatchToProps)(UCTransactionsPage);
