import * as React from "react";
import { DEFAULT_TRANSACTION, ITransaction } from "../../../models/ITransaction";
import { validateTransaction } from "../../../models/validators/TransactionValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { ControlledDateInput } from "../_ui/ControlledInputs/ControlledDateInput";
import { ControlledSelectInput } from "../_ui/ControlledInputs/ControlledSelectInput";
import { ControlledTextArea } from "../_ui/ControlledInputs/ControlledTextArea";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { ModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { SuggestionTextInput } from "../_ui/SuggestionTextInput/SuggestionTextInput";
import { DEFAULT_CURRENCY_CODE } from "../../../models/ICurrency";
import { useModelEditingState } from "../../helpers/state-hooks";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { CategoryApi } from "../../api/categories";
import { AccountApi } from "../../api/accounts";
import { TransactionApi } from "../../api/transactions";

type TransactionEditModalProps = {
  readonly transactionToEdit?: ITransaction;
  readonly onCancel: () => unknown;
  readonly onComplete: (transaction: ITransaction) => unknown;
};

function TransactionEditModal(props: TransactionEditModalProps): React.ReactElement {
  // state
  const { onCancel, onComplete, transactionToEdit } = props;
  const [currentValues, validationResult, updateModel] = useModelEditingState<ITransaction>(
    transactionToEdit || DEFAULT_TRANSACTION,
    validateTransaction,
  );
  const [editorBusy, setEditorBusy] = React.useState(false);

  // linked objects
  const [categoryList, refreshCategoryList] = CategoryApi.useCategoryList();
  const [accountList, refreshAccountList] = AccountApi.useAccountList();
  const [payeeList, refreshPayeeList] = TransactionApi.usePayeeList();
  React.useEffect(() => {
    refreshCategoryList();
    refreshAccountList();
    refreshPayeeList();
  }, []);

  // form actions
  function handleAccountChange(id: string): void {
    const account = accountList?.find((c) => c.id == id);
    updateModel({ account });
  }

  function handleCategoryChange(id: string): void {
    const category = categoryList?.find((c) => c.id == id);
    updateModel({ category });
  }

  async function saveTransaction(): Promise<void> {
    setEditorBusy(true);
    try {
      await TransactionApi.saveTransaction(currentValues);
      onComplete(currentValues);
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to save transaction", error);
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
      onClick: saveTransaction,
    },
  ];

  const errors = validationResult.errors || {};

  // must be continuous editing if there is no creation date but the account is already set
  const continuousEditing = !currentValues.creationDate && !!currentValues.account;

  const currencyNote =
    currentValues.account && currentValues.account.currencyCode !== DEFAULT_CURRENCY_CODE
      ? currentValues.account.currencyCode
      : null;

  return (
    <Modal
      title={currentValues.id ? "Edit Transaction" : "Create Transaction"}
      buttons={modalBtns}
      modalBusy={editorBusy}
      onCloseRequest={onCancel}
    >
      <div className={bs.row}>
        <div className={combine(bs.col, bs.mb3)}>
          <ControlledDateInput
            id={"transactionDate"}
            label={"Transaction Date"}
            value={formatDate(currentValues.transactionDate, "system") || ""}
            disabled={editorBusy}
            error={errors.transactionDate}
            onValueChange={(date) => updateModel({ transactionDate: date, effectiveDate: date })}
            inputProps={{
              autoFocus: !continuousEditing,
            }}
          />
        </div>
        <div className={combine(bs.col, bs.mb3)}>
          <ControlledDateInput
            id={"effectiveDate"}
            label={"Effective Date"}
            value={formatDate(currentValues.effectiveDate, "system") || ""}
            disabled={editorBusy}
            error={errors.effectiveDate}
            onValueChange={(date) => updateModel({ effectiveDate: date })}
            inputProps={{
              tabIndex: -1,
            }}
          />
        </div>
      </div>
      <div className={bs.row}>
        <div className={combine(bs.col, bs.mb3)}>
          <ControlledSelectInput
            id={"account"}
            label={"Account"}
            value={currentValues.account ? currentValues.account.id : ""}
            disabled={editorBusy || !accountList}
            error={errors.account}
            onValueChange={handleAccountChange}
            selectProps={{
              autoFocus: continuousEditing,
            }}
          >
            {accountList && <option value={""}>-- Select --</option>}
            {accountList &&
              accountList
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((a) => (
                  <option value={a.id} key={a.id}>
                    {a.name}
                  </option>
                ))}
            {!accountList && <option>Loading...</option>}
          </ControlledSelectInput>
        </div>
        <div className={combine(bs.col, bs.mb3)}>
          <SuggestionTextInput
            id={"payee"}
            label={"Payee"}
            value={currentValues.payee}
            disabled={editorBusy}
            error={errors.payee}
            onValueChange={(payee) => updateModel({ payee })}
            suggestionOptions={payeeList}
          />
        </div>
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
          <ControlledTextInput
            id={"amount"}
            label={"Amount" + (currencyNote ? ` (${currencyNote})` : "")}
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
    </Modal>
  );
}

export { TransactionEditModal };
