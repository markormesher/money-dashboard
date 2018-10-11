import * as React from "react";
import { Component, FormEvent } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IThinAccountValidationResult } from "../../../server/model-thins/ThinAccountValidator";
import { ThinCategory } from "../../../server/model-thins/ThinCategory";
import { validateThinCategory } from "../../../server/model-thins/ThinCategoryValidator";
import * as bs from "../../bootstrap-aliases";
import { generateBadge } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setCategoryToEdit, startSaveCategory } from "../../redux/settings/categories/actions";
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
	touchedFields: {
		[key: string]: boolean,
	};
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
			touchedFields: {},
		};

		this.handleTouch = this.handleTouch.bind(this);
		this.wasTouched = this.wasTouched.bind(this);
		this.handleCategoryNameInput = this.handleCategoryNameInput.bind(this);
		this.handleCategoryTypeInput = this.handleCategoryTypeInput.bind(this);
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
							<label htmlFor="name">Name</label>
							<input
									id="name"
									name="name"
									type="text"
									value={currentValues.name}
									onChange={this.handleCategoryNameInput}
									onBlur={this.handleTouch}
									disabled={editorBusy}
									className={combine(bs.formControl, errors.name && this.wasTouched("name") && bs.isInvalid)}
									placeholder="Category name"
							/>
							{
								errors.name
								&& this.wasTouched("name")
								&& <div className={bs.invalidFeedback}>{errors.name}</div>
							}
						</div>
						<div className={bs.formGroup}>
							<label>Type</label>
							<div className={bs.row}>
								<div className={bs.col}>
									{this.renderTypeCheckbox("income", "Income", bs.badgeSuccess, currentValues.isIncomeCategory)}
								</div>
								<div className={bs.col}>
									{this.renderTypeCheckbox("expense", "Expense", bs.badgeDanger, currentValues.isExpenseCategory)}
								</div>
							</div>
							<div className={bs.row}>
								<div className={bs.col}>
									{this.renderTypeCheckbox("asset", "Asset Growth", bs.badgeWarning, currentValues.isAssetGrowthCategory)}
								</div>
								<div className={bs.col}>
									{this.renderTypeCheckbox("memo", "Memo", bs.badgeInfo, currentValues.isMemoCategory)}
								</div>
							</div>
						</div>
					</form>
				</Modal>
		);
	}

	private handleTouch(event: FormEvent<HTMLInputElement | HTMLSelectElement>) {
		const id = event.currentTarget.id;
		this.setState({
			touchedFields: {
				...this.state.touchedFields,
				[id]: true,
			},
		});
	}

	private wasTouched(id: string): boolean {
		return this.state.touchedFields[id] === true;
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

	private renderTypeCheckbox(id: string, label: string, badgeClass: string, defaultChecked: boolean) {
		return (
				<div className={bs.formCheck}>
					<input
							id={`type-${id}`}
							type="checkbox"
							checked={defaultChecked}
							onChange={this.handleCategoryTypeInput}
							className={bs.formCheckInput}
					/>
					<label className={bs.formCheckLabel} htmlFor={`type-${id}`}>
						{generateBadge(label, badgeClass)}
					</label>
				</div>
		);
	}

	private handleCategoryNameInput(event: FormEvent<HTMLInputElement>) {
		this.updateModel({
			...this.state.currentValues,
			name: event.currentTarget.value,
		});
	}

	private handleCategoryTypeInput(event: FormEvent<HTMLInputElement>) {
		const id = event.currentTarget.id;
		const checked = event.currentTarget.checked;
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

		this.props.actions.startSaveCategory(this.state.currentValues);
	}

	private handleCancel() {
		this.props.actions.setCategoryToEdit(undefined);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCategoryModal);
