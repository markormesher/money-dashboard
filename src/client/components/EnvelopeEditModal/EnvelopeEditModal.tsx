import * as React from "react";
import { IEnvelope, DEFAULT_ENVELOPE } from "../../../models/IEnvelope";
import { validateEnvelope } from "../../../models/validators/EnvelopeValidator";
import { EnvelopeApi } from "../../api/envelopes";
import * as bs from "../../global-styles/Bootstrap.scss";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { useModelEditingState } from "../../helpers/state-hooks";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { ModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";

type EnvelopeEditModalProps = {
  readonly envelopeToEdit?: IEnvelope;
  readonly onCancel: () => unknown;
  readonly onComplete: () => unknown;
};

function EnvelopeEditModal(props: EnvelopeEditModalProps): React.ReactElement {
  // state
  const { onCancel, onComplete, envelopeToEdit } = props;
  const [currentValues, validationResult, updateModel] = useModelEditingState<IEnvelope>(
    envelopeToEdit || DEFAULT_ENVELOPE,
    validateEnvelope,
  );
  const [editorBusy, setEditorBusy] = React.useState(false);

  // form actions
  async function saveEnvelope(): Promise<void> {
    setEditorBusy(true);
    try {
      await EnvelopeApi.saveEnvelope(currentValues);
      onComplete();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to save envelope", error);
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
      onClick: saveEnvelope,
    },
  ];

  const errors = validationResult.errors || {};

  return (
    <Modal
      title={currentValues.id ? "Edit Envelope" : "Create Envelope"}
      buttons={modalBtns}
      modalBusy={editorBusy}
      onCloseRequest={onCancel}
    >
      <ControlledForm onSubmit={saveEnvelope}>
        <div className={bs.mb3}>
          <ControlledTextInput
            id={"name"}
            label={"Name"}
            placeholder={"Envelope Name"}
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
export { EnvelopeEditModal };
