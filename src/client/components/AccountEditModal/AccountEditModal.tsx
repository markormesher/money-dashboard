import * as React from "react";
import {
  DEFAULT_ACCOUNT,
  IAccount,
  ACCOUNT_TAG_DISPLAY_NAMES,
  isAccountTag,
  isAccountType,
} from "../../../models/IAccount";
import { validateAccount } from "../../../models/validators/AccountValidator";
import { ALL_CURRENCIES, DEFAULT_CURRENCY_CODE, isCurrencyCode } from "../../../models/ICurrency";
import bs from "../../global-styles/Bootstrap.scss";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { AccountApi } from "../../api/accounts";
import { ControlledSelectInput } from "../_ui/ControlledInputs/ControlledSelectInput";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { ModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { combine } from "../../helpers/style-helpers";
import { ControlledTextArea } from "../_ui/ControlledInputs/ControlledTextArea";
import { ControlledCheckboxInput } from "../_ui/ControlledInputs/ControlledCheckboxInput";
import { ALL_STOCKS, getStock, isStockTicker } from "../../../models/IStock";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { useModelEditingState } from "../../helpers/state-hooks";

type AccountEditModalProps = {
  readonly accountToEdit?: IAccount;
  readonly onCancel: () => unknown;
  readonly onComplete: () => unknown;
};

function AccountEditModal(props: AccountEditModalProps): React.ReactElement {
  // state
  const { onCancel, onComplete, accountToEdit } = props;
  const [currentValues, validationResult, updateModel] = useModelEditingState<IAccount>(
    accountToEdit || DEFAULT_ACCOUNT,
    validateAccount,
  );
  const [editorBusy, setEditorBusy] = React.useState(false);

  // form actions
  function handleCurrencyChange(code: string): void {
    if (isCurrencyCode(code)) {
      updateModel({ currencyCode: code });
    } else {
      updateModel({ currencyCode: DEFAULT_CURRENCY_CODE });
    }
  }

  function handleStockTickerChange(ticker: string): void {
    if (!ticker) {
      updateModel({ stockTicker: null });
    } else if (isStockTicker(ticker)) {
      const stock = getStock(ticker);
      updateModel({ stockTicker: ticker, currencyCode: stock.baseCurrency });
    }
  }

  function handleTagChange(checked: boolean, tag: string): void {
    if (checked) {
      if (isAccountTag(tag)) {
        updateModel({ tags: [...currentValues.tags, tag] });
      }
    } else {
      updateModel({ tags: currentValues.tags.filter((t) => t != tag) });
    }
  }

  async function saveAccount(): Promise<void> {
    setEditorBusy(true);
    try {
      await AccountApi.saveAccount(currentValues);
      onComplete();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to save account", error);
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
      onClick: saveAccount,
    },
  ];

  const tags = Object.entries(ACCOUNT_TAG_DISPLAY_NAMES).sort((a, b) => a[1].localeCompare(b[1]));
  const tagCheckboxes: React.ReactNode[] = tags.map(([tagKey, tagName]) => (
    <div className={bs.col} key={tagKey}>
      <ControlledCheckboxInput
        id={tagKey}
        label={tagName}
        checked={currentValues.tags.some((t) => t == tagKey)}
        disabled={editorBusy}
        onCheckedChange={(checked, id) => handleTagChange(checked, id)}
      />
    </div>
  ));

  const errors = validationResult.errors || {};

  return (
    <Modal
      title={currentValues.id ? "Edit Account" : "Create Account"}
      buttons={modalBtns}
      modalBusy={editorBusy}
      onCloseRequest={onCancel}
    >
      <ControlledForm onSubmit={saveAccount}>
        <div className={bs.row}>
          <div className={combine(bs.col, bs.mb3)}>
            <ControlledTextInput
              id={"name"}
              label={"Name"}
              placeholder={"Account Name"}
              value={currentValues.name}
              onValueChange={(name) => updateModel({ name })}
              disabled={editorBusy}
              error={errors.name}
              inputProps={{
                autoFocus: true,
              }}
            />
          </div>
          <div className={combine(bs.col, bs.mb3)}>
            <ControlledSelectInput
              id="type"
              label={"Type"}
              value={currentValues.type}
              onValueChange={(type) => {
                if (isAccountType(type)) {
                  updateModel({ type });
                }
              }}
              disabled={editorBusy}
              error={errors.type}
            >
              <option value={"current"}>Current Account</option>
              <option value={"savings"}>Savings Account</option>
              <option value={"asset"}>Asset</option>
              <option value={"other"}>Other</option>
            </ControlledSelectInput>
          </div>
        </div>
        <div className={bs.row}>
          <div className={combine(bs.col, bs.mb3)}>
            <ControlledSelectInput
              id={"currency"}
              label={"Currency"}
              value={currentValues.currencyCode}
              onValueChange={handleCurrencyChange}
              disabled={editorBusy || currentValues.stockTicker !== null}
              error={errors.currencyCode}
            >
              {ALL_CURRENCIES.sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </ControlledSelectInput>
          </div>
          <div className={combine(bs.col, bs.mb3)}>
            <ControlledSelectInput
              id={"stockTicker"}
              label={"Stock Ticker"}
              value={currentValues.stockTicker ?? ""}
              onValueChange={handleStockTickerChange}
              disabled={editorBusy}
              error={errors.stockTicker}
            >
              <option value={""}>-- Select --</option>
              {ALL_STOCKS.sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                <option key={c.ticker} value={c.ticker}>
                  {c.name}
                </option>
              ))}
            </ControlledSelectInput>
          </div>
        </div>
        <div className={bs.mb3}>
          <label className={bs.formLabel}>Tags</label>
          <div className={bs.row}>{tagCheckboxes}</div>
          {errors.tags && <div className={combine(bs.invalidFeedback, bs.dBlock)}>{errors.tags}</div>}
        </div>
        <div className={bs.mb3}>
          <label className={bs.formLabel}>Options</label>
          <div className={bs.row}>
            <div className={bs.col}>
              <ControlledCheckboxInput
                id={"includeInEnvelopes"}
                label={"Include in envelope calculations?"}
                checked={currentValues.includeInEnvelopes}
                disabled={editorBusy}
                onCheckedChange={(checked) => updateModel({ includeInEnvelopes: checked })}
              />
            </div>
            <div className={bs.col}>
              <ControlledCheckboxInput
                id={"active"}
                label={"Active?"}
                checked={currentValues.active}
                disabled={editorBusy}
                onCheckedChange={(checked) => updateModel({ active: checked })}
              />
            </div>
          </div>
        </div>
        <div className={bs.mb3}>
          <ControlledTextArea
            id={"note"}
            label={"Note"}
            value={currentValues.note}
            disabled={editorBusy}
            onValueChange={(note) => updateModel({ note })}
          />
        </div>
      </ControlledForm>
    </Modal>
  );
}

export { AccountEditModal };
