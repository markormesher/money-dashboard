import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { DEFAULT_ACCOUNT, IAccount, AccountTag, ACCOUNT_TAG_DISPLAY_NAMES } from "../../../commons/models/IAccount";
import { IAccountValidationResult, validateAccount } from "../../../commons/models/validators/AccountValidator";
import { ALL_CURRENCIES, CurrencyCode } from "../../../commons/models/ICurrency";
import * as bs from "../../global-styles/Bootstrap.scss";
import { setAccountToEdit, startSaveAccount } from "../../redux/accounts";
import { IRootState } from "../../redux/root";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { ControlledSelectInput } from "../_ui/ControlledInputs/ControlledSelectInput";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { combine } from "../../helpers/style-helpers";
import { ControlledTextArea } from "../_ui/ControlledInputs/ControlledTextArea";
import { ControlledCheckboxInput } from "../_ui/ControlledInputs/ControlledCheckboxInput";

interface IAccountEditModalProps {
  readonly accountToEdit?: IAccount;
  readonly editorBusy?: boolean;

  readonly actions?: {
    readonly setAccountToEdit: (account: IAccount) => AnyAction;
    readonly startSaveAccount: (account: Partial<IAccount>) => AnyAction;
  };
}

interface IAccountEditModalState {
  readonly currentValues: IAccount;
  readonly validationResult: IAccountValidationResult;
}

function mapStateToProps(state: IRootState, props: IAccountEditModalProps): IAccountEditModalProps {
  return {
    ...props,
    accountToEdit: state.accounts.accountToEdit,
    editorBusy: state.accounts.editorBusy,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IAccountEditModalProps): IAccountEditModalProps {
  return {
    ...props,
    actions: {
      setAccountToEdit: (account): AnyAction => dispatch(setAccountToEdit(account)),
      startSaveAccount: (account): AnyAction => dispatch(startSaveAccount(account)),
    },
  };
}

class UCAccountEditModal extends PureComponent<IAccountEditModalProps, IAccountEditModalState> {
  constructor(props: IAccountEditModalProps) {
    super(props);
    const accountToEdit = props.accountToEdit || DEFAULT_ACCOUNT;
    this.state = {
      currentValues: accountToEdit,
      validationResult: validateAccount(accountToEdit),
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
    this.handleTagCheckedChange = this.handleTagCheckedChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.updateModel = this.updateModel.bind(this);
  }

  public render(): ReactNode {
    const { editorBusy } = this.props;
    const { currentValues, validationResult } = this.state;
    const errors = validationResult.errors || {};

    const modalBtns: IModalBtn[] = [
      {
        type: ModalBtnType.CANCEL,
        onClick: this.handleCancel,
      },
      {
        type: ModalBtnType.SAVE,
        disabled: !validationResult.isValid,
        onClick: this.handleSave,
      },
    ];

    const tags = Object.entries(ACCOUNT_TAG_DISPLAY_NAMES).sort((a, b) => a[1].localeCompare(b[1]));
    const tagCheckboxes: ReactNode[] = tags.map(([tagKey, tagName]) => (
      <div className={bs.col} key={tagKey}>
        <ControlledCheckboxInput
          id={`tag-${tagKey}`}
          label={tagName}
          checked={currentValues.tags.indexOf(tagKey as AccountTag) >= 0}
          disabled={editorBusy}
          onCheckedChange={this.handleTagCheckedChange}
        />
      </div>
    ));

    return (
      <Modal
        title={currentValues.id ? "Edit Account" : "Create Account"}
        buttons={modalBtns}
        modalBusy={editorBusy}
        onCloseRequest={this.handleCancel}
      >
        <ControlledForm onSubmit={this.handleSave}>
          <div className={bs.row}>
            <div className={combine(bs.col, bs.formGroup)}>
              <ControlledTextInput
                id={"name"}
                label={"Name"}
                placeholder={"Account Name"}
                value={currentValues.name}
                onValueChange={this.handleNameChange}
                disabled={editorBusy}
                error={errors.name}
                inputProps={{
                  autoFocus: true,
                }}
              />
            </div>
          </div>
          <div className={bs.row}>
            <div className={combine(bs.col, bs.formGroup)}>
              <ControlledSelectInput
                id="type"
                label={"Type"}
                value={currentValues.type}
                onValueChange={this.handleTypeChange}
                disabled={editorBusy}
                error={errors.type}
              >
                <option value={"current"}>Current Account</option>
                <option value={"savings"}>Savings Account</option>
                <option value={"asset"}>Asset</option>
                <option value={"other"}>Other</option>
              </ControlledSelectInput>
            </div>
            <div className={combine(bs.col, bs.formGroup)}>
              <ControlledSelectInput
                id={"currency"}
                label={"Currency"}
                value={currentValues.currencyCode}
                onValueChange={this.handleCurrencyChange}
                disabled={editorBusy}
                error={errors.currencyCode}
              >
                {ALL_CURRENCIES.sort((a, b) => a.name.localeCompare(b.name)).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </ControlledSelectInput>
            </div>
          </div>
          <div className={bs.formGroup}>
            <label>Tags</label>
            <div className={bs.row}>{tagCheckboxes}</div>
          </div>
          <div className={bs.formGroup}>
            <ControlledTextArea
              id={"note"}
              label={"Note"}
              value={currentValues.note}
              disabled={editorBusy}
              onValueChange={this.handleNoteChange}
            />
          </div>
        </ControlledForm>
      </Modal>
    );
  }

  private handleNameChange(value: string): void {
    this.updateModel({ name: value });
  }

  private handleTypeChange(value: string): void {
    this.updateModel({ type: value });
  }

  private handleCurrencyChange(value: string): void {
    this.updateModel({ currencyCode: value as CurrencyCode });
  }

  private handleTagCheckedChange(checked: boolean, id: string): void {
    const tag = id.replace(/^tag-/, "") as AccountTag;
    if (checked) {
      this.updateModel({ tags: [...this.state.currentValues.tags, tag] });
    } else {
      this.updateModel({ tags: this.state.currentValues.tags.filter((t) => t !== tag) });
    }
  }

  private handleNoteChange(value: string): void {
    this.updateModel({ note: value });
  }

  private handleSave(): void {
    if (this.state.validationResult.isValid) {
      this.props.actions.startSaveAccount(this.state.currentValues);
    }
  }

  private handleCancel(): void {
    this.props.actions.setAccountToEdit(undefined);
  }

  private updateModel(account: Partial<IAccount>): void {
    const updatedAccount = {
      ...this.state.currentValues,
      ...account,
    };
    this.setState({
      currentValues: updatedAccount,
      validationResult: validateAccount(updatedAccount),
    });
  }
}

export const AccountEditModal = connect(mapStateToProps, mapDispatchToProps)(UCAccountEditModal);
