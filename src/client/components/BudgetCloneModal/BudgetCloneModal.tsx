import * as React from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { IDateRange } from "../../../models/IDateRange";
import { validateDateRange } from "../../../models/validators/DateRangeValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { useModelEditingState } from "../../helpers/state-hooks";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { BudgetApi } from "../../api/budgets";

type BudgetCloneModalProps = {
  readonly budgetsToClone: string[];
  readonly onCancel: () => unknown;
  readonly onComplete: () => unknown;
};

function BudgetCloneModal(props: BudgetCloneModalProps): React.ReactElement {
  // state
  const { onCancel, onComplete, budgetsToClone } = props;
  const [currentValues, validationResult, updateModel] = useModelEditingState<IDateRange>(
    {
      startDate: startOfMonth(new Date()).getTime(),
      endDate: endOfMonth(new Date()).getTime(),
    },
    validateDateRange,
  );
  const [editorBusy, setEditorBusy] = React.useState(false);

  // form actions
  async function cloneBudgets(): Promise<void> {
    setEditorBusy(true);
    try {
      BudgetApi.cloneBudgets(budgetsToClone, currentValues);
      onComplete();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to clone budgets", error);
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
      onClick: cloneBudgets,
    },
  ];

  // TODO: validation errors are not shown

  return (
    <Modal
      title={`Clone ${budgetsToClone.length} Budget${budgetsToClone.length !== 1 ? "s" : ""}`}
      buttons={modalBtns}
      modalBusy={editorBusy}
      onCloseRequest={onCancel}
    >
      <ControlledForm onSubmit={cloneBudgets}>
        <div className={bs.mb3}>
          <label className={bs.formLabel}>Date Range</label>
          <DateRangeChooser
            startDate={currentValues.startDate ? currentValues.startDate : undefined}
            endDate={currentValues.endDate ? currentValues.endDate : undefined}
            includeYearToDatePreset={false}
            includeAllTimePreset={false}
            onValueChange={(startDate, endDate) => {
              updateModel({ startDate, endDate });
            }}
            dropDownProps={{
              btnProps: {
                className: combine(bs.btnOutlineDark, bs.btnSm, bs.formControl),
              },
            }}
          />
        </div>
      </ControlledForm>
    </Modal>
  );
}

export { BudgetCloneModal };
