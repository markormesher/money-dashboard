import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinCategory } from "../../../server/model-thins/ThinCategory";
import { IThinCategoryValidationResult, validateThinCategory } from "../../../server/model-thins/ThinCategoryValidator";
import * as bs from "../../bootstrap-aliases";
import { generateBadge } from "../../helpers/formatters";
import { IRootState } from "../../redux/root";
import { setCategoryToEdit, startSaveCategory } from "../../redux/settings/categories/actions";
import { ControlledCheckboxInput } from "../_ui/FormComponents/ControlledCheckboxInput";
import { ControlledForm } from "../_ui/FormComponents/ControlledForm";
import { ControlledTextInput } from "../_ui/FormComponents/ControlledTextInput";
import { Modal } from "../_ui/Modal/Modal";

interface IEditCategoryModalProps {
	categoryToEdit?: ThinCategory;
	editorBusy?: boolean;

	actions?: {
		setCategoryToEdit: (category: ThinCategory) => AnyAction,
		startSaveCategory: (category: Partial<ThinCategory>) => AnyAction,
	};
}

interface IEditCategoryModalState {
	currentValues: ThinCategory;
	validationResult: IThinCategoryValidationResult;
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

class UCEditCategoryModal extends Component<IEditCategoryModalProps, IEditCategoryModalState> {

	constructor(props: IEditCategoryModalProps) {
		super(props);
		const categoryToEdit = props.categoryToEdit || ThinCategory.DEFAULT;
		this.state = {
			currentValues: categoryToEdit,
			validationResult: validateThinCategory(categoryToEdit),
		};

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleTypeCheckedChange = this.handleTypeCheckedChange.bind(this);

		this.updateModel = this.updateModel.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	public render() {
		const { editorBusy } = this.props;
		const { currentValues, validationResult } = this.state;
		const errors = validationResult.errors || {};
		return (
				<Modal
						title={currentValues.id ? "Edit Category" : "Create Category"}
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
							<ControlledTextInput
									id={"name"}
									label={"Name"}
									placeholder={"Category Name"}
									value={currentValues.name}
									onValueChange={this.handleNameChange}
									disabled={editorBusy}
									error={errors.name}
							/>
						</div>
						<div className={bs.formGroup}>
							<label>Type</label>
							<div className={bs.row}>
								<div className={bs.col}>
									<ControlledCheckboxInput
											id={"type-income"}
											label={generateBadge("Income", bs.badgeSuccess)}
											checked={currentValues.isIncomeCategory}
											disabled={editorBusy}
											onCheckedChange={this.handleTypeCheckedChange}
									/>
								</div>
								<div className={bs.col}>
									<ControlledCheckboxInput
											id={"type-expense"}
											label={generateBadge("Expense", bs.badgeDanger)}
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
											label={generateBadge("Asset Growth", bs.badgeWarning)}
											checked={currentValues.isAssetGrowthCategory}
											disabled={editorBusy}
											onCheckedChange={this.handleTypeCheckedChange}
									/>
								</div>
								<div className={bs.col}>
									<ControlledCheckboxInput
											id={"type-memo"}
											label={generateBadge("Memo", bs.badgeInfo)}
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

	private readonly handleNameChange = (value: string) => this.updateModel({ name: value });
	private readonly handleTypeCheckedChange = (checked: boolean, id: string) => {
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

	private updateModel(category: Partial<ThinCategory>) {
		const updatedCategory = {
			...this.state.currentValues,
			...category,
		};
		this.setState({
			currentValues: updatedCategory,
			validationResult: validateThinCategory(updatedCategory),
		});
	}

	private handleSave() {
		if (this.state.validationResult.isValid) {
			this.props.actions.startSaveCategory(this.state.currentValues);
		}
	}

	private handleCancel() {
		this.props.actions.setCategoryToEdit(undefined);
	}
}

export const EditCategoryModal = connect(mapStateToProps, mapDispatchToProps)(UCEditCategoryModal);
