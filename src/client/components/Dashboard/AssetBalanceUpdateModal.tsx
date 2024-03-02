import * as React from "react";
import { combine } from "../../helpers/style-helpers";
import { formatDate } from "../../helpers/formatters";
import * as bs from "../../global-styles/Bootstrap.scss";
import { ModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { IAccountBalanceUpdate } from "../../../models/IAccountBalanceUpdate";
import { validateAccountBalanceUpdate } from "../../../models/validators/AccountBalanceUpdateValidator";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { ControlledDateInput } from "../_ui/ControlledInputs/ControlledDateInput";
import { DEFAULT_CURRENCY_CODE } from "../../../models/ICurrency";
import { useModelEditingState } from "../../helpers/state-hooks";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { AccountApi } from "../../api/accounts";

type AssetBalanceUpdateModalProps = {
  readonly balanceToUpdate: IAccountBalanceUpdate;
  readonly onCancel: () => unknown;
  readonly onComplete: () => unknown;
};

function AssetBalanceUpdateModal(props: AssetBalanceUpdateModalProps): React.ReactElement {
  // state
  const { onCancel, onComplete, balanceToUpdate } = props;
  const [currentValues, validationResult, updateModel] = useModelEditingState<IAccountBalanceUpdate>(
    balanceToUpdate,
    validateAccountBalanceUpdate,
  );
  const [editorBusy, setEditorBusy] = React.useState(false);

  // form actions
  async function saveUpdate(): Promise<void> {
    setEditorBusy(true);
    try {
      await AccountApi.updateAccountBalance(currentValues);
      onComplete();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to save balance update", error);
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
      onClick: saveUpdate,
    },
  ];

  const errors = validationResult.errors || {};
  const currencyNote =
    currentValues.account && currentValues.account.currencyCode !== DEFAULT_CURRENCY_CODE
      ? currentValues.account.currencyCode
      : null;

  return (
    <Modal title={"Update Asset Balance"} buttons={modalBtns} modalBusy={editorBusy} onCloseRequest={onCancel}>
      <div className={bs.row}>
        <div className={combine(bs.col, bs.mb3)}>
          <ControlledDateInput
            id={"date"}
            label={"Date"}
            value={formatDate(currentValues.updateDate, "system") || ""}
            disabled={editorBusy}
            error={errors.updateDate}
            onValueChange={(updateDate) => updateModel({ updateDate })}
          />
        </div>
        <div className={combine(bs.col, bs.mb3)}>
          <ControlledTextInput
            id={"balance"}
            label={"Balance" + (currencyNote ? ` (${currencyNote})` : "")}
            value={!isNaN(currentValues.balance) ? currentValues.balance : ""}
            disabled={editorBusy}
            error={errors.balance}
            onValueChange={(amount) => updateModel({ balance: parseFloat(amount) })}
            inputProps={{
              type: "number",
              step: "0.01",
              min: "0",
            }}
          />
        </div>
      </div>
    </Modal>
  );
}

export { AssetBalanceUpdateModal };
