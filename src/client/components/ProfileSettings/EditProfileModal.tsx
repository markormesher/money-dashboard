import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { ThinProfile } from "../../../server/model-thins/ThinProfile";
import { IThinProfileValidationResult, validateThinProfile } from "../../../server/model-thins/ThinProfileValidator";
import * as bs from "../../bootstrap-aliases";
import { IRootState } from "../../redux/root";
import { setProfileToEdit, startSaveProfile } from "../../redux/settings/profiles/actions";
import { ControlledForm } from "../_ui/FormComponents/ControlledForm";
import { ControlledTextInput } from "../_ui/FormComponents/ControlledTextInput";
import { Modal } from "../_ui/Modal/Modal";

interface IEditProfileModalProps {
	readonly profileToEdit?: ThinProfile;
	readonly editorBusy?: boolean;

	readonly actions?: {
		readonly setProfileToEdit: (profile: ThinProfile) => AnyAction,
		readonly startSaveProfile: (profile: Partial<ThinProfile>) => AnyAction,
	};
}

interface IEditProfileModalState {
	readonly currentValues: ThinProfile;
	readonly validationResult: IThinProfileValidationResult;
}

function mapStateToProps(state: IRootState, props: IEditProfileModalProps): IEditProfileModalProps {
	return {
		...props,
		profileToEdit: state.settings.profiles.profileToEdit,
		editorBusy: state.settings.categories.editorBusy,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IEditProfileModalProps): IEditProfileModalProps {
	return {
		...props,
		actions: {
			setProfileToEdit: (profile) => dispatch(setProfileToEdit(profile)),
			startSaveProfile: ((profile) => dispatch(startSaveProfile(profile))),
		},
	};
}

class UCEditProfileModal extends PureComponent<IEditProfileModalProps, IEditProfileModalState> {

	constructor(props: IEditProfileModalProps) {
		super(props);
		const profileToEdit = props.profileToEdit || ThinProfile.DEFAULT;
		this.state = {
			currentValues: profileToEdit,
			validationResult: validateThinProfile(profileToEdit),
		};

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.updateModel = this.updateModel.bind(this);
	}

	public render() {
		const { editorBusy } = this.props;
		const { currentValues, validationResult } = this.state;
		const errors = validationResult.errors || {};
		return (
				<Modal
						title={currentValues.id ? "Edit Profile" : "Create Profile"}
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
									placeholder={"Profile Name"}
									value={currentValues.name}
									onValueChange={this.handleNameChange}
									disabled={editorBusy}
									error={errors.name}
							/>
						</div>
					</ControlledForm>
				</Modal>
		);
	}

	private handleNameChange(value: string) {
		this.updateModel({ name: value });
	}

	private handleSave() {
		if (this.state.validationResult.isValid) {
			this.props.actions.startSaveProfile(this.state.currentValues);
		}
	}

	private handleCancel() {
		this.props.actions.setProfileToEdit(undefined);
	}

	private updateModel(profile: Partial<ThinProfile>) {
		const updatedProfile = {
			...this.state.currentValues,
			...profile,
		};
		this.setState({
			currentValues: updatedProfile,
			validationResult: validateThinProfile(updatedProfile),
		});
	}
}

export const EditProfileModal = connect(mapStateToProps, mapDispatchToProps)(UCEditProfileModal);
