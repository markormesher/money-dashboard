import * as React from "react";
import { IEnvelopeAllocation, DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION } from "../../../models/IEnvelopeAllocation";
import { validateEnvelopeAllocation } from "../../../models/validators/EnvelopeAllocationValidator";
import bs from "../../global-styles/Bootstrap.scss";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { ModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { ControlledDateInput } from "../_ui/ControlledInputs/ControlledDateInput";
import { formatDate } from "../../helpers/formatters";
import { ControlledSelectInput } from "../_ui/ControlledInputs/ControlledSelectInput";
import { combine } from "../../helpers/style-helpers";
import { useModelEditingState } from "../../helpers/state-hooks";
import { CategoryApi } from "../../api/categories";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { EnvelopeApi } from "../../api/envelopes";

type EnvelopeAllocationEditModalProps = {
  readonly envelopeAllocationToEdit?: IEnvelopeAllocation;
  readonly onCancel: () => unknown;
  readonly onComplete: () => unknown;
};

function EnvelopeAllocationEditModal(props: EnvelopeAllocationEditModalProps): React.ReactElement {
  // state
  const { onCancel, onComplete, envelopeAllocationToEdit } = props;
  const [currentValues, validationResult, updateModel] = useModelEditingState<IEnvelopeAllocation>(
    envelopeAllocationToEdit || DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION,
    validateEnvelopeAllocation,
  );
  const [editorBusy, setEditorBusy] = React.useState(false);

  // linked objects
  const [categoryList, refreshCategoryList] = CategoryApi.useCategoryList();
  const [envelopeList, refreshEnvelopeList] = EnvelopeApi.useEnvelopeList();
  React.useEffect(() => {
    refreshCategoryList();
    refreshEnvelopeList();
  }, []);

  // form actions
  function handleCategoryChange(id: string): void {
    const category = categoryList?.find((c) => c.id == id);
    updateModel({ category });
  }

  function handleEnvelopeChange(id: string): void {
    const envelope = envelopeList?.find((c) => c.id == id);
    updateModel({ envelope });
  }

  async function saveEnvelopeAllocation(): Promise<void> {
    setEditorBusy(true);
    try {
      await EnvelopeApi.saveEnvelopeAllocation(currentValues);
      onComplete();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to save envelope allocation", error);
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
      onClick: saveEnvelopeAllocation,
    },
  ];

  const errors = validationResult.errors || {};

  return (
    <Modal
      title={currentValues.id ? "Edit Envelope Allocation" : "Create Envelope Allocation"}
      buttons={modalBtns}
      modalBusy={editorBusy}
      onCloseRequest={onCancel}
    >
      <ControlledForm onSubmit={saveEnvelopeAllocation}>
        <div className={bs.mb3}>
          <ControlledDateInput
            id={"startDate"}
            label={"Start Date"}
            value={formatDate(currentValues.startDate, "system") || ""}
            disabled={editorBusy}
            error={errors.startDate}
            onValueChange={(startDate) => updateModel({ startDate })}
          />
        </div>
        <div className={bs.row}>
          <div className={combine(bs.col, bs.mb3)}>
            <ControlledSelectInput
              id={"category"}
              label={"Category"}
              value={currentValues.category ? currentValues.category.id : ""}
              disabled={editorBusy || !categoryList}
              error={errors.category}
              onValueChange={handleCategoryChange}
            >
              {categoryList && <option value={""}>-- Select --</option>}
              {categoryList &&
                categoryList
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((c) => (
                    <option value={c.id} key={c.id}>
                      {c.name}
                    </option>
                  ))}
              {!categoryList && <option>Loading...</option>}
            </ControlledSelectInput>
          </div>
          <div className={combine(bs.col, bs.mb3)}>
            <ControlledSelectInput
              id={"envelope"}
              label={"Envelope"}
              value={currentValues.envelope ? currentValues.envelope.id : ""}
              disabled={editorBusy || !envelopeList}
              error={errors.envelope}
              onValueChange={handleEnvelopeChange}
            >
              {envelopeList && <option value={""}>-- Select --</option>}
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
      </ControlledForm>
    </Modal>
  );
}

export { EnvelopeAllocationEditModal };
