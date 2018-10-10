import * as React from "react";
import { Component, FormEvent } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinCategory } from "../../../server/model-thins/ThinCategory";
import * as bs from "../../bootstrap-aliases";
import { generateBadge } from "../../helpers/formatters";
import { IRootState } from "../../redux/root";
import { setCategoryToEdit, startSaveCategory } from "../../redux/settings/categories/actions";
import { Modal } from "../_ui/Modal/Modal";

// TODO: validation

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

class EditCategoryModal extends Component<IEditCategoryModalProps, ThinCategory> {

	constructor(props: IEditCategoryModalProps) {
		super(props);
		this.state = ThinCategory.DEFAULT;

		this.handleCategoryNameInput = this.handleCategoryNameInput.bind(this);
		this.handleCategoryTypeInput = this.handleCategoryTypeInput.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	public render() {
		const { categoryToEdit, editorBusy } = this.props;
		return (
				<Modal
						isOpen={categoryToEdit !== undefined}
						title={this.state.id ? "Edit Category" : "Create Category"}
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
									value={this.state.name}
									onChange={this.handleCategoryNameInput}
									disabled={editorBusy}
									className={bs.formControl}
									placeholder="Category name"
							/>
						</div>
						<div className={bs.formGroup}>
							<label>Type</label>
							<div className={bs.row}>
								<div className={bs.col}>
									{this.renderTypeCheckbox("income", "Income", bs.badgeSuccess, this.state.isIncomeCategory)}
								</div>
								<div className={bs.col}>
									{this.renderTypeCheckbox("expense", "Expense", bs.badgeDanger, this.state.isExpenseCategory)}
								</div>
							</div>
							<div className={bs.row}>
								<div className={bs.col}>
									{this.renderTypeCheckbox("asset", "Asset Growth", bs.badgeWarning, this.state.isAssetGrowthCategory)}
								</div>
								<div className={bs.col}>
									{this.renderTypeCheckbox("memo", "Memo", bs.badgeInfo, this.state.isMemoCategory)}
								</div>
							</div>
						</div>
					</form>
					<hr/>
					<pre>{JSON.stringify(this.state)}</pre>
				</Modal>
		);
	}

	public componentDidUpdate(
			prevProps: Readonly<IEditCategoryModalProps>,
			prevState: Readonly<Partial<ThinCategory>>,
			snapshot?: any,
	): void {
		if (prevProps.categoryToEdit !== this.props.categoryToEdit) {
			this.setState(this.props.categoryToEdit || ThinCategory.DEFAULT);
			this.forceUpdate();
		}
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
		this.setState({
			name: event.currentTarget.value,
		});
	}

	private handleCategoryTypeInput(event: FormEvent<HTMLInputElement>) {
		const id = event.currentTarget.id;
		const checked = event.currentTarget.checked;
		switch (id) {
			case "type-income":
				this.setState({ isIncomeCategory: checked });
				break;

			case "type-expense":
				this.setState({ isExpenseCategory: checked });
				break;

			case "type-asset":
				this.setState({ isAssetGrowthCategory: checked });
				break;

			case "type-memo":
				this.setState({ isMemoCategory: checked });
				break;
		}
	}

	private handleSave(event?: FormEvent) {
		if (event) {
			event.preventDefault();
		}

		this.props.actions.startSaveCategory(this.state);
	}

	private handleCancel() {
		this.props.actions.setCategoryToEdit(undefined);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCategoryModal);
