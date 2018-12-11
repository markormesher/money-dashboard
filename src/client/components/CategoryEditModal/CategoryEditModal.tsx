import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { DEFAULT_CATEGORY, ICategory } from "../../../server/models/ICategory";
import {
	ICategoryValidationResult,
	validateCategory,
} from "../../../server/models/validators/CategoryValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { setCategoryToEdit, startSaveCategory } from "../../redux/categories";
import { IRootState } from "../../redux/root";
import { Badge } from "../_ui/Badge/Badge";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { ControlledCheckboxInput } from "../_ui/ControlledInputs/ControlledCheckboxInput";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";

interface ICategoryEditModalProps {
	readonly categoryToEdit?: ICategory;
	readonly editorBusy?: boolean;

	readonly actions?: {
		readonly setCategoryToEdit: (category: ICategory) => AnyAction,
		readonly startSaveCategory: (category: Partial<ICategory>) => AnyAction,
	};
}

interface ICategoryEditModalState {
	readonly currentValues: ICategory;
	readonly validationResult: ICategoryValidationResult;
}

function mapStateToProps(state: IRootState, props: ICategoryEditModalProps): ICategoryEditModalProps {
	return {
		...props,
		categoryToEdit: state.categories.categoryToEdit,
		editorBusy: state.categories.editorBusy,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: ICategoryEditModalProps): ICategoryEditModalProps {
	return {
		...props,
		actions: {
			setCategoryToEdit: (category) => dispatch(setCategoryToEdit(category)),
			startSaveCategory: ((category) => dispatch(startSaveCategory(category))),
		},
	};
}

class UCCategoryEditModal extends PureComponent<ICategoryEditModalProps, ICategoryEditModalState> {

	constructor(props: ICategoryEditModalProps) {
		super(props);
		const categoryToEdit = props.categoryToEdit || DEFAULT_CATEGORY;
		this.state = {
			currentValues: categoryToEdit,
			validationResult: validateCategory(categoryToEdit),
		};

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleTypeCheckedChange = this.handleTypeCheckedChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.updateModel = this.updateModel.bind(this);
	}

	public render(): ReactNode {
		const { editorBusy } = this.props;
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
						title={currentValues.id ? "Edit Category" : "Create Category"}
						buttons={modalBtns}
						modalBusy={editorBusy}
						onCloseRequest={this.handleCancel}
				>
					<ControlledForm onSubmit={this.handleSave}>
						<div className={bs.formGroup}>
							<ControlledTextInput
									id={"name"}
									label={"Name"}
									placeholder={"Category Name"}
									value={currentValues.name}
									onValueChange={this.handleNameChange}
									disabled={editorBusy}
									error={errors.name}
									inputProps={{
										autoFocus: true,
									}}
							/>
						</div>
						<div className={bs.formGroup}>
							<label>Type</label>
							<div className={bs.row}>
								<div className={bs.col}>
									<ControlledCheckboxInput
											id={"type-income"}
											label={<Badge className={bs.badgeSuccess}>Income</Badge>}
											checked={currentValues.isIncomeCategory}
											disabled={editorBusy}
											onCheckedChange={this.handleTypeCheckedChange}
									/>
								</div>
								<div className={bs.col}>
									<ControlledCheckboxInput
											id={"type-expense"}
											label={<Badge className={bs.badgeDanger}>Expense</Badge>}
											checked={currentValues.isExpenseCategory}
											disabled={editorBusy}
											onCheckedChange={this.handleTypeCheckedChange}
									/>
								</div>
							</div>
							<div className={bs.row}>
								<div className={bs.col}>
									<ControlledCheckboxInput
											id={"type-asset"}
											label={<Badge className={bs.badgeWarning}>Asset Growth</Badge>}
											checked={currentValues.isAssetGrowthCategory}
											disabled={editorBusy}
											onCheckedChange={this.handleTypeCheckedChange}
									/>
								</div>
								<div className={bs.col}>
									<ControlledCheckboxInput
											id={"type-memo"}
											label={<Badge className={bs.badgeInfo}>Memo</Badge>}
											checked={currentValues.isMemoCategory}
											disabled={editorBusy}
											onCheckedChange={this.handleTypeCheckedChange}
									/>
								</div>
							</div>
						</div>
					</ControlledForm>
				</Modal>
		);
	}

	private handleNameChange(value: string): void {
		this.updateModel({ name: value });
	}

	private handleTypeCheckedChange(checked: boolean, id: string): void {
		switch (id) {
			case "type-income":
				this.updateModel({ isIncomeCategory: checked });
				break;

			case "type-expense":
				this.updateModel({ isExpenseCategory: checked });
				break;

			case "type-asset":
				this.updateModel({ isAssetGrowthCategory: checked });
				break;

			case "type-memo":
				this.updateModel({ isMemoCategory: checked });
				break;
		}
	}

	private handleSave(): void {
		if (this.state.validationResult.isValid) {
			this.props.actions.startSaveCategory(this.state.currentValues);
		}
	}

	private handleCancel(): void {
		this.props.actions.setCategoryToEdit(undefined);
	}

	private updateModel(category: Partial<ICategory>): void {
		const updatedCategory = {
			...this.state.currentValues,
			...category,
		};
		this.setState({
			currentValues: updatedCategory,
			validationResult: validateCategory(updatedCategory),
		});
	}
}

export const CategoryEditModal = connect(mapStateToProps, mapDispatchToProps)(UCCategoryEditModal);
