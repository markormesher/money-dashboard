import * as React from "react";
import { ReactElement, useState } from "react";
import { DEFAULT_BUDGET, IBudget } from "../../../models/IBudget";
import { validateBudget } from "../../../models/validators/BudgetValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { useModelEditingState } from "../../helpers/state-hooks";
import { combine } from "../../helpers/style-helpers";
import { Badge } from "../_ui/Badge/Badge";
import { BudgetApi } from "../../api/budgets";
import { ControlledRadioInput } from "../_ui/ControlledInputs/ControlledRadioInput";
import { ControlledSelectInput } from "../_ui/ControlledInputs/ControlledSelectInput";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { DateRangeChooser } from "../_ui/DateRangeChooser/DateRangeChooser";
import { ModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { CategoryApi } from "../../api/categories";

type BudgetEditModalProps = {
  readonly budgetToEdit?: IBudget;
  readonly onCancel: () => unknown;
  readonly onComplete: () => unknown;
};

function BudgetEditModal(props: BudgetEditModalProps): ReactElement {
  // state
  const { onCancel, onComplete, budgetToEdit } = props;
  const [currentValues, validationResult, updateModel] = useModelEditingState<IBudget>(
    budgetToEdit || DEFAULT_BUDGET,
    validateBudget,
  );
  const [editorBusy, setEditorBusy] = useState(false);

  // linked objects
  const [categoryList, refreshCategoryList] = CategoryApi.useCategoryList();
  React.useEffect(() => {
    refreshCategoryList();
  }, []);

  // form actions
  function handleCategoryChange(id: string): void {
    const category = categoryList?.find((c) => c.id == id);
    updateModel({ category });
  }

  async function saveBudget(): Promise<void> {
    setEditorBusy(true);
    try {
      await BudgetApi.saveBudget(currentValues);
      onComplete();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to save budget", error);
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
      onClick: saveBudget,
    },
  ];

  const errors = validationResult.errors || {};

  return (
    <Modal
      title={currentValues.id ? "Edit Budget" : "Create Budget"}
      buttons={modalBtns}
      modalBusy={editorBusy}
      onCloseRequest={onCancel}
    >
      <div className={bs.mb3}>
        <ControlledSelectInput
          id={"category"}
          label={"Category"}
          value={currentValues.category ? currentValues.category.id : ""}
          disabled={editorBusy || !categoryList}
          error={errors.category}
          onValueChange={handleCategoryChange}
          selectProps={{
            autoFocus: true,
          }}
        >
          {categoryList && <option value={""}>-- Select --</option>}
          {categoryList
            ?.sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => (
              <option value={c.id} key={c.id}>
                {c.name}
              </option>
            ))}
          {!categoryList && <option>Loading...</option>}
        </ControlledSelectInput>
      </div>
      <div className={bs.row}>
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
        <div className={combine(bs.col, bs.mb3)}>
          <label className={bs.formLabel}>Date Range</label>
          <DateRangeChooser
            startDate={currentValues.startDate ? currentValues.startDate : undefined}
            endDate={currentValues.endDate ? currentValues.endDate : undefined}
            includeYearToDatePreset={false}
            includeAllTimePreset={false}
            onValueChange={(startDate, endDate) => updateModel({ startDate, endDate })}
            dropDownProps={{
              btnProps: {
                className: combine(bs.btnOutlineDark, bs.btnSm, bs.formControl),
              },
            }}
          />
        </div>
      </div>
      <div className={bs.mb3}>
        <label className={bs.formLabel}>Type</label>
        <div className={bs.row}>
          <div className={bs.col}>
            <ControlledRadioInput
              id={"type-budget"}
              name={"type"}
              value={"budget"}
              label={<Badge className={bs.bgInfo}>Budget</Badge>}
              checked={currentValues.type === "budget"}
              disabled={editorBusy}
              onValueChange={() => updateModel({ type: "budget" })}
            />
          </div>
          <div className={bs.col}>
            <ControlledRadioInput
              id={"type-bill"}
              name={"type"}
              value={"bill"}
              label={<Badge className={bs.bgWarning}>Bill</Badge>}
              checked={currentValues.type === "bill"}
              disabled={editorBusy}
              onValueChange={() => updateModel({ type: "bill" })}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}

export { BudgetEditModal };
