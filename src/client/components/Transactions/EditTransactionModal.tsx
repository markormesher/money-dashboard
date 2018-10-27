import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import { ThinCategory } from "../../../server/model-thins/ThinCategory";
import { ThinTransaction } from "../../../server/model-thins/ThinTransaction";
import {
	IThinTransactionValidationResult,
	validateThinTransaction,
} from "../../../server/model-thins/ThinTransactionValidator";
import * as bs from "../../bootstrap-aliases";
import { formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { startLoadAccountList } from "../../redux/settings/accounts/actions";
import { startLoadCategoryList } from "../../redux/settings/categories/actions";
import { setTransactionToEdit, startSaveTransaction } from "../../redux/transactions/actions";
import { ControlledDateInput } from "../_ui/FormComponents/ControlledDateInput";
import { ControlledForm } from "../_ui/FormComponents/ControlledForm";
import { ControlledSelectInput } from "../_ui/FormComponents/ControlledSelectInput";
import { ControlledTextArea } from "../_ui/FormComponents/ControlledTextArea";
import { ControlledTextInput } from "../_ui/FormComponents/ControlledTextInput";
import { Modal } from "../_ui/Modal/Modal";

interface IEditTransactionModalProps {
	transactionToEdit?: ThinTransaction;
	editorBusy?: boolean;
	categoryList?: ThinCategory[];
	accountList?: ThinAccount[];

	actions?: {
		setTransactionToEdit: (transaction: ThinTransaction) => AnyAction,
		startSaveTransaction: (transaction: Partial<ThinTransaction>) => AnyAction,
		startLoadCategoryList: () => AnyAction,
		startLoadAccountList: () => AnyAction,
	};
}

interface IEditTransactionModalState {
	currentValues: ThinTransaction;
	validationResult: IThinTransactionValidationResult;
}

function mapStateToProps(state: IRootState, props: IEditTransactionModalProps): IEditTransactionModalProps {
	return {
		...props,
		transactionToEdit: state.transactions.transactionToEdit,
		editorBusy: state.transactions.editorBusy,
		categoryList: state.settings.categories.categoryList,
		accountList: state.settings.accounts.accountList,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IEditTransactionModalProps): IEditTransactionModalProps {
	return {
		...props,
		actions: {
			setTransactionToEdit: (transaction) => dispatch(setTransactionToEdit(transaction)),
			startSaveTransaction: (transaction) => dispatch(startSaveTransaction(transaction)),
			startLoadCategoryList: () => dispatch(startLoadCategoryList()),
			startLoadAccountList: () => dispatch(startLoadAccountList()),
		},
	};
}

class UCEditTransactionModal extends Component<IEditTransactionModalProps, IEditTransactionModalState> {

	constructor(props: IEditTransactionModalProps) {
		super(props);
		const transactionToEdit = props.transactionToEdit || ThinTransaction.DEFAULT;
		this.state = {
			currentValues: transactionToEdit,
			validationResult: validateThinTransaction(transactionToEdit),
		};

		this.handleTransactionDateChange = this.handleTransactionDateChange.bind(this);
		this.handleEffectiveDateChange = this.handleEffectiveDateChange.bind(this);
		this.handleAccountChange = this.handleAccountChange.bind(this);
		this.handlePayeeChange = this.handlePayeeChange.bind(this);
		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleAmountChange = this.handleAmountChange.bind(this);
		this.handleNoteChange = this.handleNoteChange.bind(this);

		this.updateModel = this.updateModel.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	public componentDidMount(): void {
		this.props.actions.startLoadCategoryList();
		this.props.actions.startLoadAccountList();
	}

	public render() {
		const { editorBusy, categoryList, accountList } = this.props;
		const { currentValues, validationResult } = this.state;
		const errors = validationResult.errors || {};
		return (
				<Modal
						title={currentValues.id ? "Edit Transaction" : "Create Transaction"}
						modalBusy={editorBusy}
						cancelBtnShown={true}
						onCancel={this.handleCancel}
						onCloseRequest={this.handleCancel}
						saveBtnShown={true}
						saveBtnDisabled={!validationResult.isValid}
						onSave={this.handleSave}
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
								/>
							</div>
						</div>
						<div className={bs.row}>
							<div className={combine(bs.col, bs.formGroup)}>
								<ControlledSelectInput
										id={"account"}
										label={"Account"}
										value={currentValues.accountId}
										disabled={editorBusy || !accountList}
										error={errors.account}
										onValueChange={this.handleAccountChange}
								>
									{accountList && (<option value={""}>-- Select --</option>)}
									{accountList && accountList.sort((a, b) => a.name.localeCompare(b.name)).map((a) => (
											<option value={a.id} key={a.id}>{a.name}</option>
									))}
									{!accountList && (<option>Loading...</option>)}
								</ControlledSelectInput>
							</div>
							<div className={combine(bs.col, bs.formGroup)}>
								<ControlledTextInput
										id={"payee"}
										label={"Payee"}
										value={currentValues.payee}
										disabled={editorBusy}
										error={errors.payee}
										onValueChange={this.handlePayeeChange}
								/>
							</div>
						</div>
						<div className={bs.row}>
							<div className={combine(bs.col, bs.formGroup)}>
								<ControlledSelectInput
										id={"category"}
										label={"Category"}
										value={currentValues.categoryId}
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

	private readonly handleTransactionDateChange = (value: string) => this.updateModel({
		transactionDate: value,
		effectiveDate: value,
	})
	private readonly handleEffectiveDateChange = (value: string) => this.updateModel({ effectiveDate: value });
	private readonly handleAccountChange = (value: string) => this.updateModel({ accountId: value });
	private readonly handlePayeeChange = (value: string) => this.updateModel({ payee: value });
	private readonly handleCategoryChange = (value: string) => this.updateModel({ categoryId: value });
	private readonly handleAmountChange = (value: string) => this.updateModel({ amount: parseFloat(value) });
	private readonly handleNoteChange = (value: string) => this.updateModel({ note: value });

	private updateModel(transaction: Partial<ThinTransaction>) {
		const updatedTransaction = {
			...this.state.currentValues,
			...transaction,
		};
		this.setState({
			currentValues: updatedTransaction,
			validationResult: validateThinTransaction(updatedTransaction),
		});
	}

	private handleSave() {
		if (this.state.validationResult.isValid) {
			this.props.actions.startSaveTransaction(this.state.currentValues);
		}
	}

	private handleCancel() {
		this.props.actions.setTransactionToEdit(undefined);
	}
}

export const EditTransactionModal = connect(mapStateToProps, mapDispatchToProps)(UCEditTransactionModal);
