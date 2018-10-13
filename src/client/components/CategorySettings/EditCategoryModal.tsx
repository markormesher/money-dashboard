import * as React from "react";
import { Component, FormEvent } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IThinAccountValidationResult } from "../../../server/model-thins/ThinAccountValidator";
import { ThinCategory } from "../../../server/model-thins/ThinCategory";
import { validateThinCategory } from "../../../server/model-thins/ThinCategoryValidator";
import * as bs from "../../bootstrap-aliases";
import { generateBadge } from "../../helpers/formatters";
import { IRootState } from "../../redux/root";
import { setCategoryToEdit, startSaveCategory } from "../../redux/settings/categories/actions";
import ControlledCheckboxInput from "../_ui/FormComponents/ControlledCheckboxInput";
import ControlledTextInput from "../_ui/FormComponents/ControlledTextInput";
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
	validationResult: IThinAccountValidationResult;
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

class EditCategoryModal extends Component<IEditCategoryModalProps, IEditCategoryModalState> {

	constructor(props: IEditCategoryModalProps) {
		super(props);
		const categoryToEdit = props.categoryToEdit || ThinCategory.DEFAULT;
		this.state = {
			currentValues: categoryToEdit,
			validationResult: validateThinCategory(categoryToEdit),
		};

		this.handleCategoryNameChange = this.handleCategoryNameChange.bind(this);
		this.handleCategoryTypeCheckedChange = this.handleCategoryTypeCheckedChange.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleSave = this.handleSave.bind(this);
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
					<form onSubmit={this.handleSave}>
						<div className={bs.formGroup}>
							<ControlledTextInput
									id={"name"}
									label={"Name"}
									placeholder={"Category Name"}
									value={currentValues.name}
									onValueChange={this.handleCategoryNameChange}
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
											onCheckedChange={this.handleCategoryTypeCheckedChange}
									/>
								</div>
								<div className={bs.col}>
									<ControlledCheckboxInput
											id={"type-expense"}
											label={generateBadge("Expense", bs.badgeDanger)}
											checked={currentValues.isExpenseCategory}
											onCheckedChange={this.handleCategoryTypeCheckedChange}
									/>
								</div>
							</div>
							<div className={bs.row}>
								<div className={bs.col}>
									<ControlledCheckboxInput
											id={"type-asset"}
											label={generateBadge("Asset Growth", bs.badgeWarning)}
											checked={currentValues.isAssetGrowthCategory}
											onCheckedChange={this.handleCategoryTypeCheckedChange}
									/>
								</div>
								<div className={bs.col}>
									<ControlledCheckboxInput
											id={"type-memo"}
											label={generateBadge("Memo", bs.badgeInfo)}
											checked={currentValues.isMemoCategory}
											onCheckedChange={this.handleCategoryTypeCheckedChange}
									/>
								</div>
							</div>
						</div>
					</form>
				</Modal>
		);
	}

	private updateModel(category: ThinCategory) {
		this.setState({ currentValues: category });
		this.validateModel(category);
	}

	private validateModel(category: ThinCategory) {
		this.setState({
			validationResult: validateThinCategory(category),
		});
	}

	private handleCategoryNameChange(newValue: string) {
		this.updateModel({
			...this.state.currentValues,
			name: newValue,
		});
	}

	private handleCategoryTypeCheckedChange(checked: boolean, id: string) {
		switch (id) {
			case "type-income":
				this.updateModel({
					...this.state.currentValues,
					isIncomeCategory: checked,
				});
				break;

			case "type-expense":
				this.updateModel({
					...this.state.currentValues,
					isExpenseCategory: checked,
				});
				break;

			case "type-asset":
				this.updateModel({
					...this.state.currentValues,
					isAssetGrowthCategory: checked,
				});
				break;

			case "type-memo":
				this.updateModel({
					...this.state.currentValues,
					isMemoCategory: checked,
				});
				break;
		}
	}

	private handleSave(event?: FormEvent) {
		if (event) {
			event.preventDefault();
		}

		if (!this.state.validationResult.isValid) {
			return;
		}

		this.props.actions.startSaveCategory(this.state.currentValues);
	}

	private handleCancel() {
		this.props.actions.setCategoryToEdit(undefined);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCategoryModal);
