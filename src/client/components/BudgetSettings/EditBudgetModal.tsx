import { Moment } from "moment";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinBudget } from "../../../server/model-thins/ThinBudget";
import { IThinBudgetValidationResult, validateThinBudget } from "../../../server/model-thins/ThinBudgetValidator";
import { ThinCategory } from "../../../server/model-thins/ThinCategory";
import * as bs from "../../bootstrap-aliases";
import { formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setBudgetToEdit, startSaveBudget } from "../../redux/settings/budgets/actions";
import { startLoadCategoryList } from "../../redux/settings/categories/actions";
import { Badge } from "../_ui/Badge/Badge";
import { ControlledDateInput } from "../_ui/FormComponents/ControlledDateInput";
import { ControlledForm } from "../_ui/FormComponents/ControlledForm";
import { ControlledRadioInput } from "../_ui/FormComponents/ControlledRadioInput";
import { ControlledSelectInput } from "../_ui/FormComponents/ControlledSelectInput";
import { ControlledTextInput } from "../_ui/FormComponents/ControlledTextInput";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import * as styles from "./BudgetModals.scss";
import { QuickDateRangeLinks } from "./QuickDateRangeLinks";

interface IEditBudgetModalProps {
	readonly budgetToEdit?: ThinBudget;
	readonly editorBusy?: boolean;
	readonly categoryList?: ThinCategory[];

	readonly actions?: {
		readonly setBudgetToEdit: (budget: ThinBudget) => AnyAction,
		readonly startSaveBudget: (budget: Partial<ThinBudget>) => AnyAction,
		readonly startLoadCategoryList: () => AnyAction,
	};
}

interface IEditBudgetModalState {
	readonly currentValues: ThinBudget;
	readonly validationResult: IThinBudgetValidationResult;
}

function mapStateToProps(state: IRootState, props: IEditBudgetModalProps): IEditBudgetModalProps {
	return {
		...props,
		budgetToEdit: state.settings.budgets.budgetToEdit,
		editorBusy: state.settings.budgets.editorBusy,
		categoryList: state.settings.categories.categoryList,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IEditBudgetModalProps): IEditBudgetModalProps {
	return {
		...props,
		actions: {
			setBudgetToEdit: (budget) => dispatch(setBudgetToEdit(budget)),
			startSaveBudget: (budget) => dispatch(startSaveBudget(budget)),
			startLoadCategoryList: () => dispatch(startLoadCategoryList()),
		},
	};
}

class UCEditBudgetModal extends PureComponent<IEditBudgetModalProps, IEditBudgetModalState> {

	constructor(props: IEditBudgetModalProps) {
		super(props);
		const budgetToEdit = props.budgetToEdit || ThinBudget.DEFAULT;
		this.state = {
			currentValues: budgetToEdit,
			validationResult: validateThinBudget(budgetToEdit),
		};

		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleAmountChange = this.handleAmountChange.bind(this);
		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.handleTypeChange = this.handleTypeChange.bind(this);
		this.handleDateRangeSelection = this.handleDateRangeSelection.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.updateModel = this.updateModel.bind(this);
	}

	public componentDidMount(): void {
		this.props.actions.startLoadCategoryList();
	}

	public render(): ReactNode {
		const { editorBusy, categoryList } = this.props;
		const { currentValues, validationResult } = this.state;
		const errors = validationResult.errors || {};

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
						title={currentValues.id ? "Edit Budget" : "Create Budget"}
						buttons={modalBtns}
						modalBusy={editorBusy}
						onCloseRequest={this.handleCancel}
				>
					<ControlledForm onSubmit={this.handleSave}>
						<div className={bs.formGroup}>
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
						<div className={bs.formGroup}>
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
						<div className={bs.row}>
							<div className={combine(bs.col, bs.formGroup)}>
								<ControlledDateInput
										id={"startDate"}
										label={"Start Date"}
										value={formatDate(currentValues.startDate, "system") || ""}
										disabled={editorBusy}
										error={errors.startDate}
										onValueChange={this.handleStartDateChange}
								/>
							</div>
							<div className={combine(bs.col, bs.formGroup)}>
								<ControlledDateInput
										id={"endDate"}
										label={"End Date"}
										value={formatDate(currentValues.endDate, "system") || ""}
										disabled={editorBusy}
										error={errors.endDate}
										onValueChange={this.handleEndDateChange}
								/>
							</div>
						</div>
						<div className={bs.row}>
							<div className={bs.col}>
								<p className={combine(styles.quickDateLinks, bs.textCenter)}>
									<QuickDateRangeLinks handleSelection={this.handleDateRangeSelection}/>
								</p>
							</div>
						</div>
						<div className={bs.formGroup}>
							<label>Type</label>
							<div className={bs.row}>
								<div className={bs.col}>
									<ControlledRadioInput
											id={"type-budget"}
											name={"type"}
											value={"budget"}
											label={<Badge className={bs.badgeInfo}>Budget</Badge>}
											checked={currentValues.type === "budget"}
											disabled={editorBusy}
											onValueChange={this.handleTypeChange}
									/>
								</div>
								<div className={bs.col}>
									<ControlledRadioInput
											id={"type-bill"}
											name={"type"}
											value={"bill"}
											label={<Badge className={bs.badgeWarning}>Bill</Badge>}
											checked={currentValues.type === "bill"}
											disabled={editorBusy}
											onValueChange={this.handleTypeChange}
									/>
								</div>
							</div>
						</div>
					</ControlledForm>
				</Modal>
		);
	}

	private handleCategoryChange(value: string): void {
		this.updateModel({ categoryId: value });
	}

	private handleAmountChange(value: string): void {
		this.updateModel({ amount: parseFloat(value) });
	}

	private handleStartDateChange(value: string): void {
		this.updateModel({ startDate: value });
	}

	private handleEndDateChange(value: string): void {
		this.updateModel({ endDate: value });
	}

	private handleTypeChange(value: string): void {
		this.updateModel({ type: value });
	}

	private handleDateRangeSelection(start: Moment, end: Moment): void {
		this.updateModel({
			startDate: formatDate(start, "system"),
			endDate: formatDate(end, "system"),
		});
	}

	private handleSave(): void {
		if (this.state.validationResult.isValid) {
			this.props.actions.startSaveBudget(this.state.currentValues);
		}
	}

	private handleCancel(): void {
		this.props.actions.setBudgetToEdit(undefined);
	}

	private updateModel(budget: Partial<ThinBudget>): void {
		const updatedBudget = {
			...this.state.currentValues,
			...budget,
		};
		this.setState({
			currentValues: updatedBudget,
			validationResult: validateThinBudget(updatedBudget),
		});
	}
}

export const EditBudgetModal = connect(mapStateToProps, mapDispatchToProps)(UCEditBudgetModal);
