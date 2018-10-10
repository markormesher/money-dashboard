import * as React from "react";
import { Component, FormEvent } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import { ThinCategory } from "../../../server/model-thins/ThinCategory";
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

class EditAccountModal extends Component<IEditAccountModalProps, ThinAccount> {

	constructor(props: IEditAccountModalProps) {
		super(props);
		this.state = ThinAccount.DEFAULT;

		this.handleAccountNameInput = this.handleAccountNameInput.bind(this);
		this.handleAccountTypeInput = this.handleAccountTypeInput.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	public render() {
		const { accountToEdit, editorBusy } = this.props;
		return (
				<Modal
						isOpen={accountToEdit !== undefined}
						title={this.state.id ? "Create Account" : "Edit Account"}
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
									value={this.state.name}
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
									value={this.state.type}
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

	public componentDidUpdate(
			prevProps: Readonly<IEditAccountModalProps>,
			prevState: Readonly<Partial<ThinCategory>>,
			snapshot?: any,
	): void {
		if (prevProps.accountToEdit !== this.props.accountToEdit) {
			this.setState(this.props.accountToEdit || ThinAccount.DEFAULT);
			this.forceUpdate();
		}
	}

	private handleAccountNameInput(event: FormEvent<HTMLInputElement>) {
		this.setState({
			name: event.currentTarget.value,
		});
	}

	private handleAccountTypeInput(event: FormEvent<HTMLSelectElement>) {
		this.setState({
			type: event.currentTarget.value,
		});
	}

	private handleSave(event?: FormEvent) {
		if (event) {
			event.preventDefault();
		}

		this.props.actions.startSaveAccount(this.state);
	}

	private handleCancel() {
		this.props.actions.setAccountToEdit(undefined);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAccountModal);
