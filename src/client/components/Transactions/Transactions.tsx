import { faPlus } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinTransaction } from "../../../server/model-thins/ThinTransaction";
import * as bs from "../../bootstrap-aliases";
import { formatCurrencyStyled } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setDisplayCurrentOnly, setTransactionToEdit, startDeleteTransaction } from "../../redux/transactions/actions";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import IconBtn from "../_ui/IconBtn/IconBtn";
import * as appStyles from "../App/App.scss";

interface ITransactionProps {
	lastUpdate: number;
	displayCurrentOnly: boolean;
	transactionToEdit?: ThinTransaction;
	actions?: {
		deleteTransaction: (id: string) => AnyAction,
		setDisplayActiveOnly: (active: boolean) => AnyAction,
		setTransactionToEdit: (transaction: ThinTransaction) => AnyAction,
	};
}

function mapStateToProps(state: IRootState, props: ITransactionProps): ITransactionProps {
	return {
		...props,
		lastUpdate: state.transactions.lastUpdate,
		displayCurrentOnly: state.transactions.displayCurrentOnly,
		transactionToEdit: state.transactions.transactionToEdit,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: ITransactionProps): ITransactionProps {
	return {
		...props,
		actions: {
			deleteTransaction: (id) => dispatch(startDeleteTransaction(id)),
			setDisplayActiveOnly: (active) => dispatch(setDisplayCurrentOnly(active)),
			setTransactionToEdit: (transaction) => dispatch(setTransactionToEdit(transaction)),
		},
	};
}

class Transactions extends Component<ITransactionProps> {

	private tableColumns: IColumn[] = [
		{
			title: "Date",
			sortField: "transactionDate",
			defaultSortDirection: "desc",
			defaultSortPriority: 0,
		},
		{ title: "Account", sortField: ["account", "name"] },
		{ title: "Payee", sortField: "payee" },
		{ title: "Amount", sortField: "amount" },
		{ title: "Category", sortField: ["category", "name"] },
		{ title: "Actions", sortable: false },
	];

	public render() {
		const { lastUpdate, transactionToEdit } = this.props;

		// TODO: edit modal

		return (
				<div>

					<div className={appStyles.headerWrapper}>
						<h1 className={combine(bs.h2, bs.floatLeft)}>Transactions</h1>
						<div className={combine(bs.btnGroup, bs.floatRight)}>
							{/*
							TODO: date mode chooser
							<CheckboxBtn
									text={"Current Transactions Only"}
									stateFilter={(state) => state.transactions.displayCurrentOnly}
									stateModifier={this.props.actions.setDisplayActiveOnly}
									btnProps={{
										className: combine(bs.btnOutlineInfo, bs.btnSm),
									}}
							/>
							*/}

							<IconBtn
									icon={faPlus}
									text={"New Transaction"}
									btnProps={{
										className: combine(bs.btnSm, bs.btnSuccess),
										onClick: () => this.props.actions.setTransactionToEdit(null),
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
								dateField: "transactionDate",
							}}
					/>
				</div>
		);
	}

	private tableRowRenderer(transaction: ThinTransaction) {
		// TODO: show selected date type
		// TODO: show info icon if alternate date is available
		// TODO: show info icon if notes are available
		// TODO: actions
		return (
				<tr key={transaction.id}>
					<td>{transaction.effectiveDate}</td>
					<td>{transaction.account.name}</td>
					<td>{transaction.payee}</td>
					<td>{formatCurrencyStyled(transaction.amount)}</td>
					<td>{transaction.category.name}</td>
					<td>Actions</td>
				</tr>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
