import { faPencil, faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinTransaction } from "../../../server/model-thins/ThinTransaction";
import * as bs from "../../bootstrap-aliases";
import { formatCurrencyStyled, formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import {
	setDateMode,
	setLastUpdate,
	setTransactionToEdit,
	startDeleteTransaction,
} from "../../redux/transactions/actions";
import { DateModeOption } from "../../redux/transactions/reducer";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DateModeToggleBtn } from "../_ui/DateModeToggleBtn/DateModeToggleBtn";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import * as appStyles from "../App/App.scss";
import { EditTransactionModal } from "./EditTransactionModal";

interface ITransactionProps {
	readonly lastUpdate: number;
	readonly dateMode: DateModeOption;
	readonly transactionToEdit?: ThinTransaction;
	readonly actions?: {
		readonly deleteTransaction: (id: string) => AnyAction,
		readonly setDateMode: (mode: DateModeOption) => AnyAction,
		readonly setLastUpdate: () => AnyAction,
		readonly setTransactionToEdit: (transaction: ThinTransaction) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: ITransactionProps): ITransactionProps {
	return {
		...props,
		lastUpdate: state.transactions.lastUpdate,
		dateMode: state.transactions.dateMode,
		transactionToEdit: state.transactions.transactionToEdit,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: ITransactionProps): ITransactionProps {
	return {
		...props,
		actions: {
			deleteTransaction: (id) => dispatch(startDeleteTransaction(id)),
			setDateMode: (active) => dispatch(setDateMode(active)),
			setLastUpdate: () => dispatch(setLastUpdate()),
			setTransactionToEdit: (transaction) => dispatch(setTransactionToEdit(transaction)),
		},
	};
}

class UCTransactions extends PureComponent<ITransactionProps> {

	private tableColumns: IColumn[] = [
		{
			title: "Date",
			sortField: "displayDate", // this is swapped for effective/transaction date on the server side
			defaultSortDirection: "desc",
			defaultSortPriority: 0,
		},
		{ title: "Account", sortField: ["account", "name"] },
		{ title: "Payee", sortField: "payee" },
		{ title: "Amount", sortField: "amount" },
		{ title: "Category", sortField: ["category", "name"] },
		{ title: "Actions", sortable: false },
	];

	constructor(props: ITransactionProps) {
		super(props);

		this.tableRowRenderer = this.tableRowRenderer.bind(this);
		this.generateActionButtons = this.generateActionButtons.bind(this);
		this.startTransactionCreation = this.startTransactionCreation.bind(this);
	}

	public render(): ReactNode {
		const { lastUpdate, dateMode, transactionToEdit } = this.props;

		return (
				<>
					{transactionToEdit !== undefined && <EditTransactionModal/>}

					<div className={appStyles.headerWrapper}>
						<h1 className={combine(bs.h2, bs.floatLeft)}>Transactions</h1>
						<div className={combine(bs.btnGroup, bs.floatRight)}>
							<DateModeToggleBtn
									value={this.props.dateMode}
									onChange={this.props.actions.setDateMode}
									btnProps={{
										className: combine(bs.btnOutlineInfo, bs.btnSm),
									}}
							/>

							<IconBtn
									icon={faPlus}
									text={"New Transaction"}
									onClick={this.startTransactionCreation}
									btnProps={{
										className: combine(bs.btnSm, bs.btnSuccess),
									}}
							/>
						</div>
					</div>

					<DataTable<ThinTransaction>
							api={"/transactions/table-data"}
							columns={this.tableColumns}
							rowRenderer={this.tableRowRenderer}
							apiExtraParams={{
								lastUpdate,
								dateMode,
							}}
					/>
				</>
		);
	}

	private tableRowRenderer(transaction: ThinTransaction): ReactElement<void> {
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

	private generateActionButtons(transaction: ThinTransaction): ReactElement<void> {
		return (
				<div className={combine(bs.btnGroup, bs.btnGroupSm)}>
					<IconBtn
							icon={faPencil}
							text={"Edit"}
							payload={transaction}
							onClick={this.props.actions.setTransactionToEdit}
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
							}}
					/>
					<DeleteBtn
							payload={transaction.id}
							onConfirmedClick={this.props.actions.deleteTransaction}
							btnProps={{
								className: combine(bs.btnOutlineDark, appStyles.btnMini),
							}}
					/>
				</div>
		);
	}

	private startTransactionCreation(): void {
		this.props.actions.setTransactionToEdit(null);
	}
}

export const Transactions = connect(mapStateToProps, mapDispatchToProps)(UCTransactions);
