import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import { IThinAccountValidationResult, validateThinAccount } from "../../../server/model-thins/ThinAccountValidator";
import * as bs from "../../bootstrap-aliases";
import { IRootState } from "../../redux/root";
import { setAccountToEdit, startSaveAccount } from "../../redux/settings/accounts/actions";
import { ControlledForm } from "../_ui/FormComponents/ControlledForm";
import { ControlledSelectInput } from "../_ui/FormComponents/ControlledSelectInput";
import { ControlledTextInput } from "../_ui/FormComponents/ControlledTextInput";
import { Modal } from "../_ui/Modal/Modal";

// TODO: de-dupe updateModel/validateModel/onSave/onCancel code

interface IEditAccountModalProps {
	accountToEdit?: ThinAccount;
	editorBusy?: boolean;

	actions?: {
		setAccountToEdit: (account: ThinAccount) => AnyAction,
		startSaveAccount: (account: Partial<ThinAccount>) => AnyAction,
	};
}

interface IEditAccountModalState {
	currentValues: ThinAccount;
	validationResult: IThinAccountValidationResult;
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

class EditAccountModal extends Component<IEditAccountModalProps, IEditAccountModalState> {

	constructor(props: IEditAccountModalProps) {
		super(props);
		const accountToEdit = props.accountToEdit || ThinAccount.DEFAULT;
		this.state = {
			currentValues: accountToEdit,
			validationResult: validateThinAccount(accountToEdit),
		};

		this.handleAccountNameChange = this.handleAccountNameChange.bind(this);
		this.handleAccountTypeChange = this.handleAccountTypeChange.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	public render() {
		const { editorBusy } = this.props;
		const { currentValues, validationResult } = this.state;
		const errors = validationResult.errors || {};
		return (
				<Modal
						title={currentValues.id ? "Edit Account" : "Create Account"}
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
									placeholder={"Account Name"}
									value={currentValues.name}
									onValueChange={this.handleAccountNameChange}
									disabled={editorBusy}
									error={errors.name}
							/>
						</div>
						<div className={bs.formGroup}>
							<ControlledSelectInput
									id="type"
									label={"Type"}
									value={currentValues.type}
									onValueChange={this.handleAccountTypeChange}
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

	private updateModel(account: ThinAccount) {
		this.setState({ currentValues: account });
		this.validateModel(account);
	}

	private validateModel(account: ThinAccount) {
		this.setState({
			validationResult: validateThinAccount(account),
		});
	}

	private handleAccountNameChange(newValue: string) {
		this.updateModel({
			...this.state.currentValues,
			name: newValue,
		});
	}

	private handleAccountTypeChange(newValue: string) {
		this.updateModel({
			...this.state.currentValues,
			type: newValue,
		});
	}

	private handleSave() {
		if (this.state.validationResult.isValid) {
			this.props.actions.startSaveAccount(this.state.currentValues);
		}
	}

	private handleCancel() {
		this.props.actions.setAccountToEdit(undefined);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAccountModal);
