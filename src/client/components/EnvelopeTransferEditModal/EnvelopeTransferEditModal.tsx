import * as React from "react";
import { DEFAULT_ENVELOPE_TRANSFER, IEnvelopeTransfer } from "../../../models/IEnvelopeTransfer";
import { validateEnvelopeTransfer } from "../../../models/validators/EnvelopeTransferValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { ControlledDateInput } from "../_ui/ControlledInputs/ControlledDateInput";
import { formatDate } from "../../helpers/formatters";
import { ControlledSelectInput } from "../_ui/ControlledInputs/ControlledSelectInput";
import { combine } from "../../helpers/style-helpers";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { ControlledTextArea } from "../_ui/ControlledInputs/ControlledTextArea";
import { useModelEditingState } from "../../helpers/state-hooks";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { EnvelopeApi } from "../../api/envelopes";

type EnvelopeTransferEditModalProps = {
  readonly transferToEdit?: IEnvelopeTransfer;
  readonly onCancel: () => unknown;
  readonly onComplete: () => unknown;
};

function EnvelopeTransferEditModal(props: EnvelopeTransferEditModalProps): React.ReactElement {
  // state
  const { onCancel, onComplete, transferToEdit } = props;
  const [currentValues, validationResult, updateModel] = useModelEditingState<IEnvelopeTransfer>(
    transferToEdit || DEFAULT_ENVELOPE_TRANSFER,
    validateEnvelopeTransfer,
  );
  const [editorBusy, setEditorBusy] = React.useState(false);

  // linked objects
  const [envelopeList, refreshEnvelopeList] = EnvelopeApi.useEnvelopeList();
  React.useEffect(() => {
    refreshEnvelopeList();
  }, []);

  // form actions
  function handleFromEnvelopeChange(id: string): void {
    const envelope = envelopeList?.find((c) => c.id == id);
    updateModel({ fromEnvelope: envelope });
  }

  function handleToEnvelopeChange(id: string): void {
    const envelope = envelopeList?.find((c) => c.id == id);
    updateModel({ toEnvelope: envelope });
  }

  async function saveTransfer(): Promise<void> {
    setEditorBusy(true);
    try {
      await EnvelopeApi.saveEnvelopeTransfer(currentValues);
      onComplete();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to save transfer", error);
      setEditorBusy(false);
    }
  }

  // ui
  const modalBtns: IModalBtn[] = [
    {
      type: ModalBtnType.CANCEL,
      onClick: onCancel,
    },
    {
      type: ModalBtnType.SAVE,
      disabled: !validationResult.isValid,
      onClick: saveTransfer,
    },
  ];

  const errors = validationResult.errors || {};

  return (
    <Modal
      title={currentValues.id ? "Edit Envelope Transfer" : "Create Envelope Transfer"}
      buttons={modalBtns}
      modalBusy={editorBusy}
      onCloseRequest={onCancel}
    >
      <ControlledForm onSubmit={saveTransfer}>
        <div className={bs.row}>
          <div className={combine(bs.col, bs.mb3)}>
            <ControlledDateInput
              id={"date"}
              label={"Date"}
              value={formatDate(currentValues.date, "system") || ""}
              disabled={editorBusy}
              error={errors.date}
              onValueChange={(date) => updateModel({ date })}
            />
          </div>
          <div className={combine(bs.col, bs.mb3)}>
            <ControlledTextInput
              id={"amount"}
              label={"Amount"}
              value={!isNaN(currentValues.amount) ? currentValues.amount : ""}
              disabled={editorBusy}
              error={errors.amount}
              onValueChange={(amount) => updateModel({ amount: parseFloat(amount) })}
              inputProps={{
                type: "number",
                step: "0.01",
                min: "0",
              }}
            />
          </div>
        </div>
        <div className={bs.row}>
          <div className={combine(bs.col, bs.mb3)}>
            <ControlledSelectInput
              id={"fromEnvelope"}
              label={"From Envelope"}
              value={currentValues.fromEnvelope ? currentValues.fromEnvelope.id : ""}
              disabled={editorBusy || !envelopeList}
              error={errors.fromEnvelope}
              onValueChange={handleFromEnvelopeChange}
            >
              {envelopeList && <option> Unallocated funds </option>}
              {envelopeList &&
                envelopeList
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
              {!envelopeList && <option>Loading...</option>}
            </ControlledSelectInput>
          </div>
          <div className={combine(bs.col, bs.mb3)}>
            <ControlledSelectInput
              id={"toEnvelope"}
              label={"To Envelope"}
              value={currentValues.toEnvelope ? currentValues.toEnvelope.id : ""}
              disabled={editorBusy || !envelopeList}
              error={errors.toEnvelope}
              onValueChange={handleToEnvelopeChange}
            >
              {envelopeList && <option>Unallocated funds</option>}
              {envelopeList &&
                envelopeList
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
              {!envelopeList && <option>Loading...</option>}
            </ControlledSelectInput>
          </div>
        </div>
        <div className={bs.mb3}>
          <ControlledTextArea
            id={"note"}
            label={"Note"}
            value={currentValues.note}
            disabled={editorBusy}
            error={errors.note}
            onValueChange={(note) => updateModel({ note })}
          />
        </div>
      </ControlledForm>
    </Modal>
  );
}

export { EnvelopeTransferEditModal };
