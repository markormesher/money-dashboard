import * as React from "react";
import { Component, FormEvent, RefObject } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import * as bs from "../../bootstrap-aliases";
import { IRootState } from "../../redux/root";
import { setAccountToEdit, startSaveAccount } from "../../redux/settings/accounts/actions";
import { Modal } from "../_ui/Modal/Modal";

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

class EditAccountModal extends Component<IEditAccountModalProps, Partial<ThinAccount>> {

	private readonly nameInputRef: RefObject<HTMLInputElement>;
	private readonly typeInputRef: RefObject<HTMLSelectElement>;

	constructor(props: IEditAccountModalProps) {
		super(props);

		this.handleCancel = this.handleCancel.bind(this);
		this.handleSave = this.handleSave.bind(this);

		this.nameInputRef = React.createRef();
		this.typeInputRef = React.createRef();
	}

	public render() {
		const { accountToEdit, editorBusy } = this.props;
		return (
				<Modal
						isOpen={accountToEdit !== undefined}
						title={accountToEdit === null ? "Create Account" : "Edit Account"}
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
									name="name"
									type="text"
									ref={this.nameInputRef}
									disabled={editorBusy}
									className={bs.formControl}
									placeholder="Account name"
									defaultValue={accountToEdit && accountToEdit.name}
							/>
						</div>
						<div className={bs.formGroup}>
							<label htmlFor="type">Type</label>
							<select
									name="type"
									ref={this.typeInputRef}
									disabled={editorBusy}
									className={bs.formControl}
									defaultValue={accountToEdit && accountToEdit.type}
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

	private handleSave(event?: FormEvent) {
		if (event) {
			event.preventDefault();
		}

		const { accountToEdit } = this.props;
		const id = accountToEdit ? accountToEdit.id : undefined;
		const name = this.nameInputRef.current.value;
		const type = this.typeInputRef.current.value;

		this.props.actions.startSaveAccount({ id, name, type });
	}

	private handleCancel() {
		this.props.actions.setAccountToEdit(undefined);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAccountModal);
