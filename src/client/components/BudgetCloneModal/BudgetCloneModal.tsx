import * as Moment from "moment";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IDateRange } from "../../../server/model-thins/IDateRange";
import { IDateRangeValidationResult, validateDateRange } from "../../../server/model-thins/IDateRangeValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { setBudgetIdsToClone, startCloneBudgets } from "../../redux/budgets";
import { IRootState } from "../../redux/root";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";

interface IBudgetCloneModalProps {
	readonly budgetIdsToClone?: string[];
	readonly editorBusy?: boolean;

	readonly actions?: {
		readonly setBudgetIdsToClone: (budgets: string[]) => AnyAction,
		readonly startCloneBudgets: (budgetIds: string[], startDate: string, endDate: string) => AnyAction,
	};
}

interface IBudgetCloneModalState {
	readonly currentValues: IDateRange;
	readonly validationResult: IDateRangeValidationResult;
}

function mapStateToProps(state: IRootState, props: IBudgetCloneModalProps): IBudgetCloneModalProps {
	return {
		...props,
		budgetIdsToClone: state.budgets.budgetIdsToClone,
		editorBusy: state.budgets.editorBusy,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IBudgetCloneModalProps): IBudgetCloneModalProps {
	return {
		...props,
		actions: {
			setBudgetIdsToClone: (budgets) => dispatch(setBudgetIdsToClone(budgets)),
			startCloneBudgets: (budgetIds, startDate, endDate) => dispatch(startCloneBudgets(budgetIds, startDate, endDate)),
		},
	};
}

class UCBudgetCloneModal extends PureComponent<IBudgetCloneModalProps, IBudgetCloneModalState> {

	constructor(props: IBudgetCloneModalProps) {
		super(props);
		const initialRange = {
			startDate: formatDate(Moment().startOf("month"), "system"),
			endDate: formatDate(Moment().endOf("month"), "system"),
		};
		this.state = {
			currentValues: initialRange,
			validationResult: validateDateRange(initialRange),
		};

		this.handleDateRangeSelection = this.handleDateRangeSelection.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.updateModel = this.updateModel.bind(this);
	}

	public render(): ReactNode {
		const { editorBusy, budgetIdsToClone } = this.props;
		const { currentValues, validationResult } = this.state;

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
						<div className={bs.formGroup}>
							<label>Date Range</label>
							<DateRangeChooser
									startDate={currentValues.startDate ? Moment(currentValues.startDate) : undefined}
									endDate={currentValues.endDate ? Moment(currentValues.endDate) : undefined}
									includeYearToDate={false}
									includeAllTime={false}
									onValueChange={this.handleDateRangeSelection}
									btnProps={{
										className: combine(bs.btnOutlineDark, bs.btnSm, bs.formControl),
									}}
							/>
						</div>
					</ControlledForm>
				</Modal>
		);
	}

	private handleDateRangeSelection(start: Moment.Moment, end: Moment.Moment): void {
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

export const BudgetCloneModal = connect(mapStateToProps, mapDispatchToProps)(UCBudgetCloneModal);
