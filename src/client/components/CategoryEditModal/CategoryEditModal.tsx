import * as React from "react";
import { ReactElement, useState } from "react";
import { DEFAULT_CATEGORY, ICategory } from "../../../models/ICategory";
import { validateCategory } from "../../../models/validators/CategoryValidator";
import { CategoryApi } from "../../api/categories";
import bs from "../../global-styles/Bootstrap.scss";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { useModelEditingState } from "../../helpers/state-hooks";
import { Badge } from "../_ui/Badge/Badge";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { ControlledCheckboxInput } from "../_ui/ControlledInputs/ControlledCheckboxInput";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { ModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";

type CategoryEditModalProps = {
  readonly categoryToEdit?: ICategory;
  readonly onCancel: () => unknown;
  readonly onComplete: () => unknown;
};

function CategoryEditModal(props: CategoryEditModalProps): ReactElement {
  // state
  const { onCancel, onComplete, categoryToEdit } = props;
  const [currentValues, validationResult, updateModel] = useModelEditingState<ICategory>(
    categoryToEdit || DEFAULT_CATEGORY,
    validateCategory,
  );
  const [editorBusy, setEditorBusy] = useState(false);

  // form actions
  function handleTypeCheckedChange(checked: boolean, id: string): void {
    switch (id) {
      case "type-income":
        updateModel({ isIncomeCategory: checked });
        break;

      case "type-expense":
        updateModel({ isExpenseCategory: checked });
        break;

      case "type-asset":
        updateModel({ isAssetGrowthCategory: checked });
        break;

      case "type-memo":
        updateModel({ isMemoCategory: checked });
        break;
    }
  }

  async function saveCategory(): Promise<void> {
    setEditorBusy(true);
    try {
      await CategoryApi.saveCategory(currentValues);
      onComplete();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to save category", error);
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
      onClick: saveCategory,
    },
  ];

  const errors = validationResult.errors || {};

  return (
    <Modal
      title={currentValues.id ? "Edit Category" : "Create Category"}
      buttons={modalBtns}
      modalBusy={editorBusy}
      onCloseRequest={onCancel}
    >
      <ControlledForm onSubmit={saveCategory}>
        <div className={bs.mb3}>
          <ControlledTextInput
            id={"name"}
            label={"Name"}
            placeholder={"Category Name"}
            value={currentValues.name}
            onValueChange={(name) => updateModel({ name })}
            disabled={editorBusy}
            error={errors.name}
            inputProps={{
              autoFocus: true,
            }}
          />
        </div>
        <div className={bs.mb3}>
          <label className={bs.formLabel}>Type</label>
          <div className={bs.row}>
            <div className={bs.col}>
              <ControlledCheckboxInput
                id={"type-income"}
                label={<Badge className={bs.bgSuccess}>Income</Badge>}
                checked={currentValues.isIncomeCategory}
                disabled={editorBusy}
                onCheckedChange={handleTypeCheckedChange}
              />
            </div>
            <div className={bs.col}>
              <ControlledCheckboxInput
                id={"type-expense"}
                label={<Badge className={bs.bgDanger}>Expense</Badge>}
                checked={currentValues.isExpenseCategory}
                disabled={editorBusy}
                onCheckedChange={handleTypeCheckedChange}
              />
            </div>
          </div>
          <div className={bs.row}>
            <div className={bs.col}>
              <ControlledCheckboxInput
                id={"type-asset"}
                label={<Badge className={bs.bgWarning}>Asset Growth</Badge>}
                checked={currentValues.isAssetGrowthCategory}
                disabled={editorBusy}
                onCheckedChange={handleTypeCheckedChange}
              />
            </div>
            <div className={bs.col}>
              <ControlledCheckboxInput
                id={"type-memo"}
                label={<Badge className={bs.bgInfo}>Memo</Badge>}
                checked={currentValues.isMemoCategory}
                disabled={editorBusy}
                onCheckedChange={handleTypeCheckedChange}
              />
            </div>
          </div>
        </div>
      </ControlledForm>
    </Modal>
  );
}

export { CategoryEditModal };
