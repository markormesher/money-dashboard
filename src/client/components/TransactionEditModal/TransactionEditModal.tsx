import * as Moment from "moment";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { DEFAULT_ACCOUNT, IAccount } from "../../../server/models/IAccount";
import { DEFAULT_CATEGORY, ICategory } from "../../../server/models/ICategory";
import { DEFAULT_TRANSACTION, ITransaction } from "../../../server/models/ITransaction";
import {
	ITransactionValidationResult,
	validateTransaction,
} from "../../../server/models/validators/TransactionValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { startLoadAccountList } from "../../redux/accounts";
import { startLoadCategoryList } from "../../redux/categories";
import { IRootState } from "../../redux/root";
import { setTransactionToEdit, startLoadPayeeList, startSaveTransaction } from "../../redux/transactions";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { ControlledDateInput } from "../_ui/ControlledInputs/ControlledDateInput";
import { ControlledSelectInput } from "../_ui/ControlledInputs/ControlledSelectInput";
import { ControlledTextArea } from "../_ui/ControlledInputs/ControlledTextArea";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { SuggestionTextInput } from "../_ui/SuggestionTextInput/SuggestionTextInput";

interface ITransactionEditModalProps {
	readonly transactionToEdit?: ITransaction;
	readonly editorBusy?: boolean;
	readonly categoryList?: ICategory[];
	readonly accountList?: IAccount[];
	readonly payeeList?: string[];

	readonly actions?: {
		readonly setTransactionToEdit: (transaction: ITransaction) => AnyAction,
		readonly startSaveTransaction: (transaction: Partial<ITransaction>) => AnyAction,
		readonly startLoadCategoryList: () => AnyAction,
		readonly startLoadAccountList: () => AnyAction,
		readonly startLoadPayeeList: () => AnyAction,
	};
}

interface ITransactionEditModalState {
	readonly currentValues: ITransaction;
	readonly validationResult: ITransactionValidationResult;
}

function mapStateToProps(state: IRootState, props: ITransactionEditModalProps): ITransactionEditModalProps {
	return {
		...props,
		transactionToEdit: state.transactions.transactionToEdit,
		editorBusy: state.transactions.editorBusy,
		categoryList: state.categories.categoryList,
		accountList: state.accounts.accountList,
		payeeList: state.transactions.payeeList,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: ITransactionEditModalProps): ITransactionEditModalProps {
	return {
		...props,
		actions: {
			setTransactionToEdit: (transaction) => dispatch(setTransactionToEdit(transaction)),
			startSaveTransaction: (transaction) => dispatch(startSaveTransaction(transaction)),
			startLoadCategoryList: () => dispatch(startLoadCategoryList()),
			startLoadAccountList: () => dispatch(startLoadAccountList()),
			startLoadPayeeList: () => dispatch(startLoadPayeeList()),
		},
	};
}

class UCTransactionEditModal extends PureComponent<ITransactionEditModalProps, ITransactionEditModalState> {

	constructor(props: ITransactionEditModalProps) {
		super(props);
		const transactionToEdit = props.transactionToEdit || DEFAULT_TRANSACTION;
		this.state = {
			currentValues: transactionToEdit,
			validationResult: validateTransaction(transactionToEdit),
		};

		this.handleTransactionDateChange = this.handleTransactionDateChange.bind(this);
		this.handleEffectiveDateChange = this.handleEffectiveDateChange.bind(this);
		this.handleAccountChange = this.handleAccountChange.bind(this);
		this.handlePayeeChange = this.handlePayeeChange.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleAmountChange = this.handleAmountChange.bind(this);
		this.handleNoteChange = this.handleNoteChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.updateModel = this.updateModel.bind(this);
	}

	public componentDidMount(): void {
		this.props.actions.startLoadCategoryList();
		this.props.actions.startLoadAccountList();
		this.props.actions.startLoadPayeeList();
	}

	public render(): ReactNode {
		const { editorBusy, categoryList, accountList, payeeList } = this.props;
		const { currentValues, validationResult } = this.state;
		const errors = validationResult.errors || {};

		// TODO
		// const continuousEditing = currentValues.createdAt === null && currentValues.accountId !== undefined;
		const continuousEditing = false;

		const modalBtns: IModalBtn[] = [
			{
				type: ModalBtnType.CANCEL,
				onClick: this.handleCancel,
			},
			{
				type: ModalBtnType.SAVE,
				disabled: !validationResult.isValid,
				onClick: this.handleSave,
			},
		];

		return (
				<Modal
						title={currentValues.id ? "Edit Transaction" : "Create Transaction"}
						buttons={modalBtns}
						modalBusy={editorBusy}
						onCloseRequest={this.handleCancel}
				>
					<ControlledForm onSubmit={this.handleSave}>
						<div className={bs.row}>
							<div className={combine(bs.col, bs.formGroup)}>
								<ControlledDateInput
										id={"transactionDate"}
										label={"Transaction Date"}
										value={formatDate(currentValues.transactionDate, "system") || ""}
										disabled={editorBusy}
										error={errors.transactionDate}
										onValueChange={this.handleTransactionDateChange}
										inputProps={{
											autoFocus: !continuousEditing,
										}}
								/>
							</div>
							<div className={combine(bs.col, bs.formGroup)}>
								<ControlledDateInput
										id={"effectiveDate"}
										label={"Effective Date"}
										value={formatDate(currentValues.effectiveDate, "system") || ""}
										disabled={editorBusy}
										error={errors.effectiveDate}
										onValueChange={this.handleEffectiveDateChange}
										inputProps={{
											tabIndex: -1,
										}}
								/>
							</div>
						</div>
						<div className={bs.row}>
							<div className={combine(bs.col, bs.formGroup)}>
								<ControlledSelectInput
										id={"account"}
										label={"Account"}
										value={currentValues.account ? currentValues.account.id : null}
										disabled={editorBusy || !accountList}
										error={errors.account}
										onValueChange={this.handleAccountChange}
										selectProps={{
											autoFocus: continuousEditing,
										}}
								>
									{accountList && (<option value={""}>-- Select --</option>)}
									{accountList && accountList.sort((a, b) => a.name.localeCompare(b.name)).map((a) => (
											<option value={a.id} key={a.id}>{a.name}</option>
									))}
									{!accountList && (<option>Loading...</option>)}
								</ControlledSelectInput>
							</div>
							<div className={combine(bs.col, bs.formGroup)}>
								<SuggestionTextInput
										id={"payee"}
										label={"Payee"}
										value={currentValues.payee}
										disabled={editorBusy}
										error={errors.payee}
										onValueChange={this.handlePayeeChange}
										suggestionOptions={payeeList}
								/>
							</div>
						</div>
						<div className={bs.row}>
							<div className={combine(bs.col, bs.formGroup)}>
								<ControlledSelectInput
										id={"category"}
										label={"Category"}
										value={currentValues.category ? currentValues.category.id : null}
										disabled={editorBusy || !categoryList}
										error={errors.category}
										onValueChange={this.handleCategoryChange}
								>
									{categoryList && (<option value={""}>-- Select --</option>)}
									{categoryList && categoryList.sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
											<option value={c.id} key={c.id}>{c.name}</option>
									))}
									{!categoryList && (<option>Loading...</option>)}
								</ControlledSelectInput>
							</div>
							<div className={combine(bs.col, bs.formGroup)}>
								<ControlledTextInput
										id={"amount"}
										label={"Amount"}
										value={!isNaN(currentValues.amount) ? currentValues.amount : ""}
										disabled={editorBusy}
										error={errors.amount}
										onValueChange={this.handleAmountChange}
										inputProps={{
											type: "number",
											step: "0.01",
											min: "0",
										}}
								/>
							</div>
						</div>
						<div className={bs.formGroup}>
							<ControlledTextArea
									id={"note"}
									label={"Note"}
									value={currentValues.note}
									disabled={editorBusy}
									error={errors.note}
									onValueChange={this.handleNoteChange}
							/>
						</div>
					</ControlledForm>
				</Modal>
		);
	}

	private handleTransactionDateChange(value: Moment.Moment): void {
		this.updateModel({
			transactionDate: value,
			effectiveDate: value,
		});
	}

	private handleEffectiveDateChange(value: Moment.Moment): void {
		this.updateModel({ effectiveDate: value });
	}

	private handleAccountChange(value: string): void {
		this.updateModel({
			account: {
				...DEFAULT_ACCOUNT,
				id: value,
			},
		});
	}

	private handlePayeeChange(value: string): void {
		this.updateModel({ payee: value });
	}

	private handleCategoryChange(value: string): void {
		this.updateModel({
			category: {
				...DEFAULT_CATEGORY,
				id: value,
			},
		});
	}

	private handleAmountChange(value: string): void {
		this.updateModel({ amount: parseFloat(value) });
	}

	private handleNoteChange(value: string): void {
		this.updateModel({ note: value });
	}

	private handleSave(): void {
		if (this.state.validationResult.isValid) {
			this.props.actions.startSaveTransaction(this.state.currentValues);
		}
	}

	private handleCancel(): void {
		this.props.actions.setTransactionToEdit(undefined);
	}

	private updateModel(transaction: Partial<ITransaction>): void {
		const updatedTransaction = {
			...this.state.currentValues,
			...transaction,
		};
		this.setState({
			currentValues: updatedTransaction,
			validationResult: validateTransaction(updatedTransaction),
		});
	}
}

export const TransactionEditModal = connect(mapStateToProps, mapDispatchToProps)(UCTransactionEditModal);
