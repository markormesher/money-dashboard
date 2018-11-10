import * as moment from "moment";
import { Moment } from "moment";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IDateRange } from "../../../server/model-thins/IDateRange";
import { IDateRangeValidationResult, validateDateRange } from "../../../server/model-thins/IDateRangeValidator";
import * as bs from "../../bootstrap-aliases";
import { formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setBudgetIdsToClone, startCloneBudgets } from "../../redux/settings/budgets/actions";
import { ControlledDateInput } from "../_ui/FormComponents/ControlledDateInput";
import { ControlledForm } from "../_ui/FormComponents/ControlledForm";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import * as styles from "./BudgetModals.scss";
import { QuickDateRangeLinks } from "./QuickDateRangeLinks";

interface ICloneBudgetModalProps {
	readonly budgetIdsToClone?: string[];
	readonly editorBusy?: boolean;

	readonly actions?: {
		readonly setBudgetIdsToClone: (budgets: string[]) => AnyAction,
		readonly startCloneBudgets: (budgetIds: string[], startDate: string, endDate: string) => AnyAction,
	};
}

interface ICloneBudgetModalState {
	readonly currentValues: IDateRange;
	readonly validationResult: IDateRangeValidationResult;
}

function mapStateToProps(state: IRootState, props: ICloneBudgetModalProps): ICloneBudgetModalProps {
	return {
		...props,
		budgetIdsToClone: state.settings.budgets.budgetIdsToClone,
		editorBusy: state.settings.budgets.editorBusy,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: ICloneBudgetModalProps): ICloneBudgetModalProps {
	return {
		...props,
		actions: {
			setBudgetIdsToClone: (budgets) => dispatch(setBudgetIdsToClone(budgets)),
			startCloneBudgets: (budgetIds, startDate, endDate) => dispatch(startCloneBudgets(budgetIds, startDate, endDate)),
		},
	};
}

class UCCloneBudgetModal extends PureComponent<ICloneBudgetModalProps, ICloneBudgetModalState> {

	constructor(props: ICloneBudgetModalProps) {
		super(props);
		const initialRange = {
			startDate: formatDate(moment().startOf("month"), "system"),
			endDate: formatDate(moment().endOf("month"), "system"),
		};
		this.state = {
			currentValues: initialRange,
			validationResult: validateDateRange(initialRange),
		};

		this.handleStartDateChange = this.handleStartDateChange.bind(this);
		this.handleEndDateChange = this.handleEndDateChange.bind(this);
		this.handleDateRangeSelection = this.handleDateRangeSelection.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.updateModel = this.updateModel.bind(this);
	}

	public render(): ReactNode {
		const { editorBusy, budgetIdsToClone } = this.props;
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
						title={`Clone ${budgetIdsToClone.length} Budget${(budgetIdsToClone.length !== 1 ? "s" : "")}`}
						buttons={modalBtns}
						modalBusy={editorBusy}
						onCloseRequest={this.handleCancel}
				>
					<ControlledForm onSubmit={this.handleSave}>
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
					</ControlledForm>
				</Modal>
		);
	}

	private handleStartDateChange(value: string): void {
		this.updateModel({ startDate: value });
	}

	private handleEndDateChange(value: string): void {
		this.updateModel({ endDate: value });
	}

	private handleDateRangeSelection(start: Moment, end: Moment): void {
		this.updateModel({
			startDate: formatDate(start, "system"),
			endDate: formatDate(end, "system"),
		});
	}

	private handleSave(): void {
		if (this.state.validationResult.isValid) {
			this.props.actions.startCloneBudgets(
					this.props.budgetIdsToClone,
					this.state.currentValues.startDate,
					this.state.currentValues.endDate,
			);
		}
	}

	private handleCancel(): void {
		this.props.actions.setBudgetIdsToClone(undefined);
	}

	private updateModel(range: Partial<IDateRange>): void {
		const updatedRange = {
			...this.state.currentValues,
			...range,
		};
		this.setState({
			currentValues: updatedRange,
			validationResult: validateDateRange(updatedRange),
		});
	}
}

export const CloneBudgetModal = connect(mapStateToProps, mapDispatchToProps)(UCCloneBudgetModal);
