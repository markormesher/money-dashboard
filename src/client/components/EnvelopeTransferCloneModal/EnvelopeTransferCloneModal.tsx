import * as React from "react";
import { startOfDay } from "date-fns";
import bs from "../../global-styles/Bootstrap.scss";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { ModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { ControlledDateInput } from "../_ui/ControlledInputs/ControlledDateInput";
import { formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { validateDate } from "../../../models/validators/DateValidator";
import { useModelEditingState } from "../../helpers/state-hooks";
import { IDate } from "../../../models/IDate";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { EnvelopeApi } from "../../api/envelopes";

type EnvelopeTransferCloneModalProps = {
  readonly transferIdsToClone: string[];
  readonly onCancel: () => void;
  readonly onComplete: () => void;
};

function EnvelopeTransferCloneModal(props: EnvelopeTransferCloneModalProps): React.ReactElement {
  // state
  const { onCancel, onComplete, transferIdsToClone } = props;
  const [currentValues, validationResult, updateModel] = useModelEditingState<IDate>(
    { date: startOfDay(new Date()).getTime() },
    validateDate,
  );
  const [editorBusy, setEditorBusy] = React.useState(false);

  // form actions
  async function cloneTransfers(): Promise<void> {
    setEditorBusy(true);
    try {
      await EnvelopeApi.cloneEnvelopeTransfers(transferIdsToClone, currentValues);
      onComplete();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to clone transfers", error);
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
      onClick: cloneTransfers,
    },
  ];

  const errors = validationResult.errors || {};

  return (
    <Modal
      title={`Clone ${transferIdsToClone.length} Transfer${transferIdsToClone.length !== 1 ? "s" : ""}`}
      buttons={modalBtns}
      modalBusy={editorBusy}
      onCloseRequest={onCancel}
    >
      <ControlledForm onSubmit={cloneTransfers}>
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
        </div>
      </ControlledForm>
    </Modal>
  );
}

export { EnvelopeTransferCloneModal };
