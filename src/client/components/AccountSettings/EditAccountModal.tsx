import * as React from "react";
import { Component, FormEvent } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import * as bs from "../../bootstrap-aliases";
import { IRootState } from "../../redux/root";
import { setAccountToEdit, startSaveAccount } from "../../redux/settings/accounts/actions";
import { Modal } from "../_ui/Modal/Modal";

// TODO: validation

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
	currentErrors: {
		name?: string[],
	};
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
		this.state = {
			currentValues: props.accountToEdit || ThinAccount.DEFAULT,
			currentErrors: {},
		};

		this.handleAccountNameInput = this.handleAccountNameInput.bind(this);
		this.handleAccountTypeInput = this.handleAccountTypeInput.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	public render() {
		const { editorBusy } = this.props;
		const { currentValues } = this.state;
		return (
				<Modal
						title={currentValues.id ? "Edit Account" : "Create Account"}
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
									onChange={this.handleAccountNameInput}
									disabled={editorBusy}
									className={bs.formControl}
									placeholder="Account name"
									value={currentValues.name}
							/>
						</div>
						<div className={bs.formGroup}>
							<label htmlFor="type">Type</label>
							<select
									id="type"
									name="type"
									onChange={this.handleAccountTypeInput}
									disabled={editorBusy}
									className={bs.formControl}
									value={currentValues.type}
							>
								<option value={"current"}>Current Account</option>
								<option value={"savings"}>Savings Account</option>
								<option value={"asset"}>Asset</option>
								<option value={"other"}>Other</option>
							</select>
						</div>
					</form>
				</Modal>
		);
	}

	private handleAccountNameInput(event: FormEvent<HTMLInputElement>) {
		this.setState({
			currentValues: {
				...this.state.currentValues,
				name: event.currentTarget.value,
			},
		});
	}

	private handleAccountTypeInput(event: FormEvent<HTMLSelectElement>) {
		this.setState({
			currentValues: {
				...this.state.currentValues,
				type: event.currentTarget.value,
			},
		});
	}

	private handleSave(event?: FormEvent) {
		if (event) {
			event.preventDefault();
		}

		this.props.actions.startSaveAccount(this.state.currentValues);
	}

	private handleCancel() {
		this.props.actions.setAccountToEdit(undefined);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAccountModal);
