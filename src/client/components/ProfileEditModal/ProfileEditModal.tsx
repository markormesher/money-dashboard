import * as React from "react";
import { ReactElement, useState } from "react";
import { IProfile } from "../../../models/IProfile";
import { validateProfile } from "../../../models/validators/ProfileValidator";
import { ProfileApi } from "../../api/users-and-profiles";
import * as bs from "../../global-styles/Bootstrap.scss";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { useModelEditingState } from "../../helpers/state-hooks";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { ModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";

type ProfileEditModalProps = {
  readonly profileToEdit: IProfile;
  readonly onCancel: () => unknown;
  readonly onComplete: () => unknown;
};

function ProfileEditModal(props: ProfileEditModalProps): ReactElement {
  // state
  const { onCancel, onComplete, profileToEdit } = props;
  const [currentValues, validationResult, updateModel] = useModelEditingState<IProfile>(profileToEdit, validateProfile);
  const [editorBusy, setEditorBusy] = useState(false);

  // form actions
  async function saveProfile(): Promise<void> {
    setEditorBusy(true);
    try {
      await ProfileApi.saveProfile(currentValues);
      onComplete();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to save profile", error);
      setEditorBusy(false);
    }
  }

  // ui
  const modalBtns: ModalBtn[] = [
    {
      type: ModalBtnType.CANCEL,
      onClick: onCancel,
    },
    {
      type: ModalBtnType.SAVE,
      disabled: !validationResult.isValid,
      onClick: saveProfile,
    },
  ];

  const errors = validationResult.errors || {};

  return (
    <Modal
      title={currentValues.id ? "Edit Profile" : "Create Profile"}
      buttons={modalBtns}
      modalBusy={editorBusy}
      onCloseRequest={onCancel}
    >
      <ControlledForm onSubmit={saveProfile}>
        <div className={bs.mb3}>
          <ControlledTextInput
            id={"name"}
            label={"Name"}
            placeholder={"Profile Name"}
            value={currentValues.name}
            onValueChange={(name) => updateModel({ name })}
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

export { ProfileEditModal };
