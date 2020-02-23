import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { DEFAULT_PROFILE, IProfile } from "../../../commons/models/IProfile";
import { IProfileValidationResult, validateProfile } from "../../../commons/models/validators/ProfileValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { setProfileToEdit, startSaveProfile } from "../../redux/profiles";
import { IRootState } from "../../redux/root";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";

interface IProfileEditModalProps {
  readonly profileToEdit?: IProfile;
  readonly editorBusy?: boolean;

  readonly actions?: {
    readonly setProfileToEdit: (profile: IProfile) => AnyAction;
    readonly startSaveProfile: (profile: Partial<IProfile>) => AnyAction;
  };
}

interface IProfileEditModalState {
  readonly currentValues: IProfile;
  readonly validationResult: IProfileValidationResult;
}

function mapStateToProps(state: IRootState, props: IProfileEditModalProps): IProfileEditModalProps {
  return {
    ...props,
    profileToEdit: state.profiles.profileToEdit,
    editorBusy: state.categories.editorBusy,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IProfileEditModalProps): IProfileEditModalProps {
  return {
    ...props,
    actions: {
      setProfileToEdit: (profile): AnyAction => dispatch(setProfileToEdit(profile)),
      startSaveProfile: (profile): AnyAction => dispatch(startSaveProfile(profile)),
    },
  };
}

class UCProfileEditModal extends PureComponent<IProfileEditModalProps, IProfileEditModalState> {
  constructor(props: IProfileEditModalProps) {
    super(props);
    const profileToEdit = props.profileToEdit || DEFAULT_PROFILE;
    this.state = {
      currentValues: profileToEdit,
      validationResult: validateProfile(profileToEdit),
    };

    this.handleNameChange = this.handleNameChange.bind(this);
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
        title={currentValues.id ? "Edit Profile" : "Create Profile"}
        buttons={modalBtns}
        modalBusy={editorBusy}
        onCloseRequest={this.handleCancel}
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
              inputProps={{
                autoFocus: true,
              }}
            />
          </div>
        </ControlledForm>
      </Modal>
    );
  }

  private handleNameChange(value: string): void {
    this.updateModel({ name: value });
  }

  private handleSave(): void {
    if (this.state.validationResult.isValid) {
      this.props.actions.startSaveProfile(this.state.currentValues);
    }
  }

  private handleCancel(): void {
    this.props.actions.setProfileToEdit(undefined);
  }

  private updateModel(profile: Partial<IProfile>): void {
    const updatedProfile = {
      ...this.state.currentValues,
      ...profile,
    };
    this.setState({
      currentValues: updatedProfile,
      validationResult: validateProfile(updatedProfile),
    });
  }
}

export const ProfileEditModal = connect(mapStateToProps, mapDispatchToProps)(UCProfileEditModal);
