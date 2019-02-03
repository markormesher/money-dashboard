import * as Moment from "moment";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { DEFAULT_BUDGET, IBudget } from "../../../commons/models/IBudget";
import { DEFAULT_CATEGORY, ICategory } from "../../../commons/models/ICategory";
import { IBudgetValidationResult, validateBudget } from "../../../commons/models/validators/BudgetValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { setBudgetToEdit, startSaveBudget } from "../../redux/budgets";
import { startLoadCategoryList } from "../../redux/categories";
import { IRootState } from "../../redux/root";
import { Badge } from "../_ui/Badge/Badge";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { ControlledRadioInput } from "../_ui/ControlledInputs/ControlledRadioInput";
import { ControlledSelectInput } from "../_ui/ControlledInputs/ControlledSelectInput";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";

interface IBudgetEditModalProps {
	readonly budgetToEdit?: IBudget;
	readonly editorBusy?: boolean;
	readonly categoryList?: ICategory[];

	readonly actions?: {
		readonly setBudgetToEdit: (budget: IBudget) => AnyAction,
		readonly startSaveBudget: (budget: IBudget) => AnyAction,
		readonly startLoadCategoryList: () => AnyAction,
	};
}

interface IBudgetEditModalState {
	readonly currentValues: IBudget;
	readonly validationResult: IBudgetValidationResult;
}

function mapStateToProps(state: IRootState, props: IBudgetEditModalProps): IBudgetEditModalProps {
	return {
		...props,
		budgetToEdit: state.budgets.budgetToEdit,
		editorBusy: state.budgets.editorBusy,
		categoryList: state.categories.categoryList,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IBudgetEditModalProps): IBudgetEditModalProps {
	return {
		...props,
		actions: {
			setBudgetToEdit: (budget) => dispatch(setBudgetToEdit(budget)),
			startSaveBudget: (budget) => dispatch(startSaveBudget(budget)),
			startLoadCategoryList: () => dispatch(startLoadCategoryList()),
		},
	};
}

class UCBudgetEditModal extends PureComponent<IBudgetEditModalProps, IBudgetEditModalState> {

	constructor(props: IBudgetEditModalProps) {
		super(props);
		const budgetToEdit = props.budgetToEdit || DEFAULT_BUDGET;
		this.state = {
			currentValues: budgetToEdit,
			validationResult: validateBudget(budgetToEdit),
		};

		this.handleCategoryChange = this.handleCategoryChange.bind(this);
		this.handleAmountChange = this.handleAmountChange.bind(this);
		this.handleDateRangeSelection = this.handleDateRangeSelection.bind(this);
		this.handleTypeChange = this.handleTypeChange.bind(this);
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
									value={currentValues.category ? currentValues.category.id : ""}
									disabled={editorBusy || !categoryList}
									error={errors.category}
									onValueChange={this.handleCategoryChange}
									selectProps={{
										autoFocus: true,
									}}
							>
								{categoryList && (<option value={""}>-- Select --</option>)}
								{categoryList && categoryList.sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
										<option value={c.id} key={c.id}>{c.name}</option>
								))}
								{!categoryList && (<option>Loading...</option>)}
							</ControlledSelectInput>
						</div>
						<div className={bs.row}>
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
							<div className={combine(bs.col, bs.formGroup)}>
								<label>Date Range</label>
								<DateRangeChooser
										startDate={currentValues.startDate ? (currentValues.startDate as Moment.Moment) : undefined}
										endDate={currentValues.endDate ? (currentValues.endDate as Moment.Moment) : undefined}
										includeYearToDatePreset={false}
										includeAllTimePreset={false}
										onValueChange={this.handleDateRangeSelection}
										btnProps={{
											className: combine(bs.btnOutlineDark, bs.btnSm, bs.formControl),
										}}
								/>
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

	private handleDateRangeSelection(start: Moment.Moment, end: Moment.Moment): void {
		this.updateModel({
			startDate: start,
			endDate: end,
		});
	}

	private handleTypeChange(value: string): void {
		if (value === "bill" || value === "budget") {
			this.updateModel({ type: value });
		}
	}

	private handleSave(): void {
		if (this.state.validationResult.isValid) {
			this.props.actions.startSaveBudget(this.state.currentValues);
		}
	}

	private handleCancel(): void {
		this.props.actions.setBudgetToEdit(undefined);
	}

	private updateModel(budget: Partial<IBudget>): void {
		const updatedBudget = {
			...this.state.currentValues,
			...budget,
		};
		this.setState({
			currentValues: updatedBudget,
			validationResult: validateBudget(updatedBudget),
		});
	}
}

export const BudgetEditModal = connect(mapStateToProps, mapDispatchToProps)(UCBudgetEditModal);
