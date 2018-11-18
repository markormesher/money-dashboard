import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinCategory } from "../../../server/model-thins/ThinCategory";
import { IThinCategoryValidationResult, validateThinCategory } from "../../../server/model-thins/ThinCategoryValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { IRootState } from "../../redux/root";
import { setCategoryToEdit, startSaveCategory } from "../../redux/settings/categories/actions";
import { Badge } from "../_ui/Badge/Badge";
import { ControlledCheckboxInput } from "../_ui/FormComponents/ControlledCheckboxInput";
import { ControlledDateInput } from "../_ui/FormComponents/ControlledDateInput";
import { ControlledForm } from "../_ui/FormComponents/ControlledForm";
import { ControlledTextInput } from "../_ui/FormComponents/ControlledTextInput";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";

interface IEditCategoryModalProps {
	readonly categoryToEdit?: ThinCategory;
	readonly editorBusy?: boolean;

	readonly actions?: {
		readonly setCategoryToEdit: (category: ThinCategory) => AnyAction,
		readonly startSaveCategory: (category: Partial<ThinCategory>) => AnyAction,
	};
}

interface IEditCategoryModalState {
	readonly currentValues: ThinCategory;
	readonly validationResult: IThinCategoryValidationResult;
}

function mapStateToProps(state: IRootState, props: IEditCategoryModalProps): IEditCategoryModalProps {
	return {
		...props,
		categoryToEdit: state.settings.categories.categoryToEdit,
		editorBusy: state.settings.categories.editorBusy,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IEditCategoryModalProps): IEditCategoryModalProps {
	return {
		...props,
		actions: {
			setCategoryToEdit: (category) => dispatch(setCategoryToEdit(category)),
			startSaveCategory: ((category) => dispatch(startSaveCategory(category))),
		},
	};
}

class UCEditCategoryModal extends PureComponent<IEditCategoryModalProps, IEditCategoryModalState> {

	constructor(props: IEditCategoryModalProps) {
		super(props);
		const categoryToEdit = props.categoryToEdit || ThinCategory.DEFAULT;
		this.state = {
			currentValues: categoryToEdit,
			validationResult: validateThinCategory(categoryToEdit),
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

	private updateModel(category: Partial<ThinCategory>): void {
		const updatedCategory = {
			...this.state.currentValues,
			...category,
		};
		this.setState({
			currentValues: updatedCategory,
			validationResult: validateThinCategory(updatedCategory),
		});
	}
}

export const EditCategoryModal = connect(mapStateToProps, mapDispatchToProps)(UCEditCategoryModal);
