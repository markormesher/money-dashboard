import * as React from "react";
import { Component, FormEvent, RefObject } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinCategory } from "../../../server/model-thins/ThinCategory";
import * as bs from "../../bootstrap-aliases";
import { generateBadge } from "../../helpers/formatters";
import { IRootState } from "../../redux/root";
import { setCategoryToEdit, startSaveCategory } from "../../redux/settings/categories/actions";
import { Modal } from "../_ui/Modal/Modal";

// TODO: validation

// TODO: using refs feels like a hack

interface IEditCategoryModalProps {
	categoryToEdit?: ThinCategory;
	editorBusy?: boolean;

	actions?: {
		setCategoryToEdit: (category: ThinCategory) => AnyAction,
		startSaveCategory: (category: Partial<ThinCategory>) => AnyAction,
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

class EditCategoryModal extends Component<IEditCategoryModalProps, Partial<ThinCategory>> {

	private static renderTypeCheckbox(
			id: string, label: string, badgeClass: string, ref: RefObject<HTMLInputElement>,
			defaultChecked: boolean,
	) {
		return (
				<div className={bs.formCheck}>
					<input
							id={id}
							type="checkbox"
							ref={ref}
							className={bs.formCheckInput}
							defaultChecked={defaultChecked}
					/>
					<label className={bs.formCheckLabel} htmlFor={id}>
						{generateBadge(label, badgeClass)}
					</label>
				</div>
		);
	}

	private readonly nameInputRef: RefObject<HTMLInputElement>;
	private readonly incomeTypeRef: RefObject<HTMLInputElement>;
	private readonly expenseTypeRef: RefObject<HTMLInputElement>;
	private readonly assetGrowthTypeRef: RefObject<HTMLInputElement>;
	private readonly memoTypeRef: RefObject<HTMLInputElement>;

	constructor(props: IEditCategoryModalProps) {
		super(props);

		this.handleCancel = this.handleCancel.bind(this);
		this.handleSave = this.handleSave.bind(this);

		this.nameInputRef = React.createRef();
		this.incomeTypeRef = React.createRef();
		this.expenseTypeRef = React.createRef();
		this.assetGrowthTypeRef = React.createRef();
		this.memoTypeRef = React.createRef();
	}

	public render() {
		const { categoryToEdit, editorBusy } = this.props;
		return (
				<Modal
						isOpen={categoryToEdit !== undefined}
						title={categoryToEdit === null ? "Create Category" : "Edit Category"}
						buttons={["cancel", "save"]}
						modalBusy={editorBusy}
						onCancel={this.handleCancel}
						onSave={this.handleSave}
						onCloseRequest={this.handleCancel}
				>
					<form onSubmit={this.handleSave}>
						<div className={bs.formGroup}>
							<label htmlFor="name">Name</label>
							<input
									id="name"
									name="name"
									type="text"
									ref={this.nameInputRef}
									disabled={editorBusy}
									className={bs.formControl}
									placeholder="Category name"
									defaultValue={categoryToEdit && categoryToEdit.name}
							/>
						</div>
						<div className={bs.formGroup}>
							<label>Type</label>
							<div className={bs.row}>
								<div className={bs.col}>
									{EditCategoryModal.renderTypeCheckbox(
											"type-income", "Income", bs.badgeSuccess, this.incomeTypeRef,
											categoryToEdit && categoryToEdit.isIncomeCategory,
									)}
								</div>
								<div className={bs.col}>
									{EditCategoryModal.renderTypeCheckbox(
											"type-expense", "Expense", bs.badgeDanger, this.expenseTypeRef,
											categoryToEdit && categoryToEdit.isExpenseCategory,
									)}
								</div>
							</div>
							<div className={bs.row}>
								<div className={bs.col}>
									{EditCategoryModal.renderTypeCheckbox(
											"type-asset", "Asset Growth", bs.badgeWarning, this.assetGrowthTypeRef,
											categoryToEdit && categoryToEdit.isAssetGrowthCategory,
									)}
								</div>
								<div className={bs.col}>
									{EditCategoryModal.renderTypeCheckbox(
											"type-memo", "Memo", bs.badgeInfo, this.memoTypeRef,
											categoryToEdit && categoryToEdit.isMemoCategory,
									)}
								</div>
							</div>
						</div>
					</form>
				</Modal>
		);
	}

	private handleSave(event?: FormEvent) {
		if (event) {
			event.preventDefault();
		}

		const { categoryToEdit } = this.props;
		const id = categoryToEdit ? categoryToEdit.id : undefined;
		const name = this.nameInputRef.current.value;
		const isIncomeCategory = this.incomeTypeRef.current.checked;
		const isExpenseCategory = this.expenseTypeRef.current.checked;
		const isAssetGrowthCategory = this.assetGrowthTypeRef.current.checked;
		const isMemoCategory = this.memoTypeRef.current.checked;

		this.props.actions.startSaveCategory({
			id,
			name,
			isIncomeCategory,
			isExpenseCategory,
			isAssetGrowthCategory,
			isMemoCategory,
		});
	}

	private handleCancel() {
		this.props.actions.setCategoryToEdit(undefined);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCategoryModal);
