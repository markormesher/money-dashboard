import { Moment } from "moment";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinBudget } from "../../../server/model-thins/ThinBudget";
import { IThinBudgetValidationResult, validateThinBudget } from "../../../server/model-thins/ThinBudgetValidator";
import { ThinCategory } from "../../../server/model-thins/ThinCategory";
import * as bs from "../../bootstrap-aliases";
import { formatDate, generateBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setBudgetToEdit, startSaveBudget } from "../../redux/settings/budgets/actions";
import { startLoadCategoryList } from "../../redux/settings/categories/actions";
import { ControlledDateInput } from "../_ui/FormComponents/ControlledDateInput";
import { ControlledForm } from "../_ui/FormComponents/ControlledForm";
import { ControlledRadioInput } from "../_ui/FormComponents/ControlledRadioInput";
import { ControlledSelectInput } from "../_ui/FormComponents/ControlledSelectInput";
import { ControlledTextInput } from "../_ui/FormComponents/ControlledTextInput";
import { Modal } from "../_ui/Modal/Modal";
import * as styles from "./EditBudgetModal.scss";
import { QuickDateRangeLinks } from "./QuickDateRangeLinks";

interface IEditBudgetModalProps {
	budgetToEdit?: ThinBudget;
	editorBusy?: boolean;
	categoryList?: ThinCategory[];

	actions?: {
		setBudgetToEdit: (budget: ThinBudget) => AnyAction,
		startSaveBudget: (budget: Partial<ThinBudget>) => AnyAction,
		startLoadCategoryList: () => AnyAction,
	};
}

interface IEditBudgetModalState {
	currentValues: ThinBudget;
	validationResult: IThinBudgetValidationResult;
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

class EditBudgetModal extends Component<IEditBudgetModalProps, IEditBudgetModalState> {

	constructor(props: IEditBudgetModalProps) {
		super(props);
		const budgetToEdit = props.budgetToEdit || ThinBudget.DEFAULT;
		this.state = {
			currentValues: budgetToEdit,
			validationResult: validateThinBudget(budgetToEdit),
		};

		this.handleBudgetCategoryChange = this.handleBudgetCategoryChange.bind(this);
		this.handleBudgetAmountChange = this.handleBudgetAmountChange.bind(this);
		this.handleBudgetStartDateChange = this.handleBudgetStartDateChange.bind(this);
		this.handleBudgetEndDateChange = this.handleBudgetEndDateChange.bind(this);
		this.handleBudgetTypeChange = this.handleBudgetTypeChange.bind(this);
		this.handleDateRangeSelection = this.handleDateRangeSelection.bind(this);

		this.updateModel = this.updateModel.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	public componentDidMount(): void {
		this.props.actions.startLoadCategoryList();
	}

	public render() {
		const { editorBusy, categoryList } = this.props;
		const { currentValues, validationResult } = this.state;
		const errors = validationResult.errors || {};
		return (
				<Modal
						title={currentValues.id ? "Edit Budget" : "Create Budget"}
						modalBusy={editorBusy}
						cancelBtnShown={true}
						onCancel={this.handleCancel}
						onCloseRequest={this.handleCancel}
						saveBtnShown={true}
						saveBtnDisabled={!validationResult.isValid}
						onSave={this.handleSave}
				>
					<ControlledForm onSubmit={this.handleSave}>
						<div className={bs.formGroup}>
							<ControlledSelectInput
									id={"category"}
									label={"Category"}
									value={currentValues.categoryId}
									disabled={editorBusy || !categoryList}
									error={errors.category}
									onValueChange={this.handleBudgetCategoryChange}
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
									onValueChange={this.handleBudgetAmountChange}
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
										onValueChange={this.handleBudgetStartDateChange}
								/>
							</div>
							<div className={combine(bs.col, bs.formGroup)}>
								<ControlledDateInput
										id={"endDate"}
										label={"End Date"}
										value={formatDate(currentValues.endDate, "system") || ""}
										disabled={editorBusy}
										error={errors.endDate}
										onValueChange={this.handleBudgetEndDateChange}
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
											label={generateBadge("Budget", bs.badgeInfo)}
											checked={currentValues.type === "budget"}
											disabled={editorBusy}
											onValueChange={this.handleBudgetTypeChange}
									/>
								</div>
								<div className={bs.col}>
									<ControlledRadioInput
											id={"type-bill"}
											name={"type"}
											value={"bill"}
											label={generateBadge("Bill", bs.badgeWarning)}
											checked={currentValues.type === "bill"}
											disabled={editorBusy}
											onValueChange={this.handleBudgetTypeChange}
									/>
								</div>
							</div>
						</div>
					</ControlledForm>
				</Modal>
		);
	}

	private readonly handleBudgetCategoryChange = (value: string) => this.updateModel({ categoryId: value });
	private readonly handleBudgetAmountChange = (value: string) => this.updateModel({ amount: parseFloat(value) });
	private readonly handleBudgetStartDateChange = (value: string) => this.updateModel({ startDate: value });
	private readonly handleBudgetEndDateChange = (value: string) => this.updateModel({ endDate: value });
	private readonly handleBudgetTypeChange = (value: string) => this.updateModel({ type: value });

	private handleDateRangeSelection(start: Moment, end: Moment) {
		this.updateModel({
			startDate: formatDate(start, "system"),
			endDate: formatDate(end, "system"),
		});
	}

	private updateModel(budget: Partial<ThinBudget>) {
		const updatedBudget = {
			...this.state.currentValues,
			...budget,
		};
		this.setState({
			currentValues: updatedBudget,
			validationResult: validateThinBudget(updatedBudget),
		});
	}

	private handleSave() {
		if (this.state.validationResult.isValid) {
			this.props.actions.startSaveBudget(this.state.currentValues);
		}
	}

	private handleCancel() {
		this.props.actions.setBudgetToEdit(undefined);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditBudgetModal);
