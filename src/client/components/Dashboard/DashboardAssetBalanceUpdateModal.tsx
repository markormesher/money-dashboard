import { PureComponent, ReactNode } from "react";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch, AnyAction } from "redux";
import { combine } from "../../helpers/style-helpers";
import { formatDate } from "../../helpers/formatters";
import { IAccountBalance } from "../../../commons/models/IAccountBalance";
import * as bs from "../../global-styles/Bootstrap.scss";
import { IRootState } from "../../redux/root";
import { setAssetBalanceToUpdate, startSaveAssetBalanceUpdate } from "../../redux/dashboard";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { IAccountBalanceUpdate, mapAccountBalanceToUpdate } from "../../../commons/models/IAccountBalanceUpdate";
import {
  IAccountBalanceUpdateValidationResult,
  validateAccountBalanceUpdate,
} from "../../../commons/models/validators/AccountBalanceUpdateValidator";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { ControlledDateInput } from "../_ui/ControlledInputs/ControlledDateInput";
import { DEFAULT_CURRENCY_CODE } from "../../../commons/models/ICurrency";

interface IDashboardAssetBalanceUpdateModalProps {
  readonly assetBalanceToUpdate?: IAccountBalance;
  readonly editorBusy?: boolean;

  readonly actions?: {
    readonly setAssetBalanceToUpdate: (assetBalance: IAccountBalance) => AnyAction;
    readonly startSaveAssetBalanceUpdate: (assetBalanceUpdate: IAccountBalanceUpdate) => AnyAction;
  };
}

interface IDashboardAssetBalanceUpdateModalState {
  readonly currentValues?: IAccountBalanceUpdate;
  readonly validationResult?: IAccountBalanceUpdateValidationResult;
}

function mapStateToProps(
  state: IRootState,
  props: IDashboardAssetBalanceUpdateModalProps,
): IDashboardAssetBalanceUpdateModalProps {
  return {
    ...props,
    assetBalanceToUpdate: state.dashboard.assetBalanceToUpdate,
    editorBusy: state.dashboard.assetBalanceUpdateEditorBusy,
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  props: IDashboardAssetBalanceUpdateModalProps,
): IDashboardAssetBalanceUpdateModalProps {
  return {
    ...props,
    actions: {
      setAssetBalanceToUpdate: (assetBalance: IAccountBalance): AnyAction =>
        dispatch(setAssetBalanceToUpdate(assetBalance)),
      startSaveAssetBalanceUpdate: (assetBalanceUpdate: IAccountBalanceUpdate): AnyAction =>
        dispatch(startSaveAssetBalanceUpdate(assetBalanceUpdate)),
    },
  };
}

class UCDashboardAssetBalanceUpdateModal extends PureComponent<
  IDashboardAssetBalanceUpdateModalProps,
  IDashboardAssetBalanceUpdateModalState
> {
  constructor(props: IDashboardAssetBalanceUpdateModalProps) {
    super(props);
    const balanceUpdate = mapAccountBalanceToUpdate(props.assetBalanceToUpdate);
    this.state = {
      currentValues: balanceUpdate,
      validationResult: validateAccountBalanceUpdate(balanceUpdate),
    };

    this.handleBalanceChange = this.handleBalanceChange.bind(this);
    this.handleUpdateDateChange = this.handleUpdateDateChange.bind(this);
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

    const currencyNote =
      currentValues.account && currentValues.account.currencyCode !== DEFAULT_CURRENCY_CODE
        ? currentValues.account.currencyCode
        : null;

    return (
      <Modal
        title={"Update Asset Balance"}
        buttons={modalBtns}
        modalBusy={editorBusy}
        onCloseRequest={this.handleCancel}
      >
        <ControlledForm onSubmit={this.handleSave}>
          <div className={bs.row}>
            <div className={combine(bs.col, bs.formGroup)}>
              <ControlledDateInput
                id={"date"}
                label={"Date"}
                value={formatDate(currentValues.updateDate, "system") || ""}
                disabled={editorBusy}
                error={errors.updateDate}
                onValueChange={this.handleUpdateDateChange}
              />
            </div>
            <div className={combine(bs.col, bs.formGroup)}>
              <ControlledTextInput
                id={"balance"}
                label={"Balance" + (currencyNote ? ` (${currencyNote})` : "")}
                value={!isNaN(currentValues.balance) ? currentValues.balance : ""}
                disabled={editorBusy}
                error={errors.balance}
                onValueChange={this.handleBalanceChange}
                inputProps={{
                  type: "number",
                  step: "0.01",
                  min: "0",
                }}
              />
            </div>
          </div>
        </ControlledForm>
      </Modal>
    );
  }

  private handleUpdateDateChange(value: number): void {
    this.updateModel({
      updateDate: value,
    });
  }

  private handleBalanceChange(value: string): void {
    this.updateModel({ balance: parseFloat(value) });
  }

  private handleSave(): void {
    if (this.state.validationResult.isValid) {
      this.props.actions.startSaveAssetBalanceUpdate(this.state.currentValues);
    }
  }

  private handleCancel(): void {
    this.props.actions.setAssetBalanceToUpdate(undefined);
  }

  private updateModel(balance: Partial<IAccountBalanceUpdate>): void {
    const updatedBalance = {
      ...this.state.currentValues,
      ...balance,
    };
    this.setState({
      currentValues: updatedBalance,
      validationResult: validateAccountBalanceUpdate(updatedBalance),
    });
  }
}

export const DashboardAssetBalanceUpdateModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(UCDashboardAssetBalanceUpdateModal);
