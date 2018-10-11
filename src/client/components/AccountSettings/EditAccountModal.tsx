import * as React from "react";
import { Component, FormEvent } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import { IThinAccountValidationResult, validateThinAccount } from "../../../server/model-thins/ThinAccountValidator";
import * as bs from "../../bootstrap-aliases";
import { combine } from "../../helpers/style-helpers";
import { IRootState } from "../../redux/root";
import { setAccountToEdit, startSaveAccount } from "../../redux/settings/accounts/actions";
import { Modal } from "../_ui/Modal/Modal";

// TODO: dedupe efforts in validation
// TODO: clean up error checs around inputs

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
	touchedFields: {
		[key: string]: boolean,
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
		const accountToEdit = props.accountToEdit || ThinAccount.DEFAULT;
		this.state = {
			currentValues: accountToEdit,
			validationResult: validateThinAccount(accountToEdit),
			touchedFields: {},
		};

		this.handleTouch = this.handleTouch.bind(this);
		this.wasTouched = this.wasTouched.bind(this);
		this.handleAccountNameInput = this.handleAccountNameInput.bind(this);
		this.handleAccountTypeInput = this.handleAccountTypeInput.bind(this);
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
					<form onSubmit={this.handleSave}>
						<div className={bs.formGroup}>
							<label htmlFor="name">Name</label>
							<input
									id="name"
									name="name"
									type="text"
									onChange={this.handleAccountNameInput}
									disabled={editorBusy}
									className={combine(bs.formControl, errors.name && this.wasTouched("name") && bs.isInvalid)}
									placeholder="Account name"
									value={currentValues.name}
									onBlur={this.handleTouch}
							/>
							{
								errors.name
								&& this.wasTouched("name")
								&& <div className={bs.invalidFeedback}>{errors.name}</div>
							}
						</div>
						<div className={bs.formGroup}>
							<label htmlFor="type">Type</label>
							<select
									id="type"
									name="type"
									onChange={this.handleAccountTypeInput}
									disabled={editorBusy}
									className={combine(bs.formControl, errors.type && this.wasTouched("type") && bs.isInvalid)}
									onBlur={this.handleTouch}
									value={currentValues.type}
							>
								<option value={"current"}>Current Account</option>
								<option value={"savings"}>Savings Account</option>
								<option value={"asset"}>Asset</option>
								<option value={"other"}>Other</option>
							</select>
							{
								errors.type
								&& this.wasTouched("type")
								&& <div className={bs.invalidFeedback}>{errors.type}</div>
							}
						</div>
					</form>
					<hr/>
					<pre>{JSON.stringify(validationResult, null, 2)}</pre>
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

	private updateModel(account: ThinAccount) {
		this.setState({ currentValues: account });
		this.validateModel(account);
	}

	private validateModel(account: ThinAccount) {
		this.setState({
			validationResult: validateThinAccount(account),
		});
	}

	private handleAccountNameInput(event: FormEvent<HTMLInputElement>) {
		this.updateModel({
			...this.state.currentValues,
			name: event.currentTarget.value,
		});
	}

	private handleAccountTypeInput(event: FormEvent<HTMLSelectElement>) {
		this.updateModel({
			...this.state.currentValues,
			type: event.currentTarget.value,
		});
	}

	private handleSave(event?: FormEvent) {
		if (event) {
			event.preventDefault();
		}

		if (!this.state.validationResult.isValid) {
			return;
		}

		this.props.actions.startSaveAccount(this.state.currentValues);
	}

	private handleCancel() {
		this.props.actions.setAccountToEdit(undefined);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(EditAccountModal);
