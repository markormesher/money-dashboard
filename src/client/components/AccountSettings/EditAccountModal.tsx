import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import { IThinAccountValidationResult, validateThinAccount } from "../../../server/model-thins/ThinAccountValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { IRootState } from "../../redux/root";
import { setAccountToEdit, startSaveAccount } from "../../redux/settings/accounts/actions";
import { ControlledDateInput } from "../_ui/FormComponents/ControlledDateInput";
import { ControlledForm } from "../_ui/FormComponents/ControlledForm";
import { ControlledSelectInput } from "../_ui/FormComponents/ControlledSelectInput";
import { ControlledTextInput } from "../_ui/FormComponents/ControlledTextInput";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";

interface IEditAccountModalProps {
	readonly accountToEdit?: ThinAccount;
	readonly editorBusy?: boolean;

	readonly actions?: {
		readonly setAccountToEdit: (account: ThinAccount) => AnyAction,
		readonly startSaveAccount: (account: Partial<ThinAccount>) => AnyAction,
	};
}

interface IEditAccountModalState {
	readonly currentValues: ThinAccount;
	readonly validationResult: IThinAccountValidationResult;
}

function mapStateToProps(state: IRootState, props: IEditAccountModalProps): IEditAccountModalProps {
	return {
		...props,
		accountToEdit: state.settings.accounts.accountToEdit,
		editorBusy: state.settings.accounts.editorBusy,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IEditAccountModalProps): IEditAccountModalProps {
	return {
		...props,
		actions: {
			setAccountToEdit: (account) => dispatch(setAccountToEdit(account)),
			startSaveAccount: ((account) => dispatch(startSaveAccount(account))),
		},
	};
}

class UCEditAccountModal extends PureComponent<IEditAccountModalProps, IEditAccountModalState> {

	constructor(props: IEditAccountModalProps) {
		super(props);
		const accountToEdit = props.accountToEdit || ThinAccount.DEFAULT;
		this.state = {
			currentValues: accountToEdit,
			validationResult: validateThinAccount(accountToEdit),
		};

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleTypeChange = this.handleTypeChange.bind(this);
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
						title={currentValues.id ? "Edit Account" : "Create Account"}
						buttons={modalBtns}
						modalBusy={editorBusy}
						onCloseRequest={this.handleCancel}
				>
					<ControlledForm onSubmit={this.handleSave}>
						<div className={bs.formGroup}>
							<ControlledTextInput
									id={"name"}
									label={"Name"}
									placeholder={"Account Name"}
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
							<ControlledSelectInput
									id="type"
									label={"Type"}
									value={currentValues.type}
									onValueChange={this.handleTypeChange}
									disabled={editorBusy}
									error={errors.type}
							>
								<option value={"current"}>Current Account</option>
								<option value={"savings"}>Savings Account</option>
								<option value={"asset"}>Asset</option>
								<option value={"other"}>Other</option>
							</ControlledSelectInput>
						</div>
					</ControlledForm>
				</Modal>
		);
	}

	private handleNameChange(value: string): void {
		this.updateModel({ name: value });
	}

	private handleTypeChange(value: string): void {
		this.updateModel({ type: value });
	}

	private handleSave(): void {
		if (this.state.validationResult.isValid) {
			this.props.actions.startSaveAccount(this.state.currentValues);
		}
	}

	private handleCancel(): void {
		this.props.actions.setAccountToEdit(undefined);
	}

	private updateModel(account: Partial<ThinAccount>): void {
		const updatedAccount = {
			...this.state.currentValues,
			...account,
		};
		this.setState({
			currentValues: updatedAccount,
			validationResult: validateThinAccount(updatedAccount),
		});
	}
}

export const EditAccountModal = connect(mapStateToProps, mapDispatchToProps)(UCEditAccountModal);
