import * as React from "react";
import { ReactNode, Component } from "react";
import axios from "axios";
import * as bs from "../../global-styles/Bootstrap.scss";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { ControlledDateInput } from "../_ui/ControlledInputs/ControlledDateInput";
import { formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { IDateValidationResult, validateDate } from "../../../models/validators/DateValidator";

type EnvelopeTransferCloneModalProps = {
  readonly onCancel: () => void;
  readonly onSave: () => void;
  readonly transferIdsToClone: string[];
};

type EnvelopeTransferCloneModalState = {
  readonly editorBusy: boolean;

  readonly newDate: number;
  readonly validationResult: IDateValidationResult;
};

class EnvelopeTransferCloneModal extends Component<EnvelopeTransferCloneModalProps, EnvelopeTransferCloneModalState> {
  constructor(props: EnvelopeTransferCloneModalProps) {
    super(props);
    const newDate = new Date().getTime();
    this.state = {
      editorBusy: false,
      newDate,
      validationResult: validateDate(newDate),
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  public render(): ReactNode {
    const { editorBusy, newDate, validationResult } = this.state;
    const { transferIdsToClone } = this.props;

    const errors = validationResult.errors || {};

    const modalBtns: IModalBtn[] = [
      {
        type: ModalBtnType.CANCEL,
        onClick: this.props.onCancel,
      },
      {
        type: ModalBtnType.SAVE,
        disabled: !validationResult.isValid,
        onClick: this.handleSave,
      },
    ];

    return (
      <Modal
        title={`Clone ${transferIdsToClone.length} Transfer${transferIdsToClone.length !== 1 ? "s" : ""}`}
        buttons={modalBtns}
        modalBusy={editorBusy}
        onCloseRequest={this.props.onCancel}
      >
        <ControlledForm onSubmit={this.handleSave}>
          <div className={bs.row}>
            <div className={combine(bs.col, bs.mb3)}>
              <ControlledDateInput
                id={"date"}
                label={"Date"}
                value={formatDate(newDate, "system") || ""}
                disabled={editorBusy}
                error={errors.date}
                onValueChange={this.handleDateChange}
              />
            </div>
          </div>
        </ControlledForm>
      </Modal>
    );
  }

  private handleDateChange(value: number): void {
    this.setState({
      newDate: value,
      validationResult: validateDate(value),
    });
  }

  private async handleSave(): Promise<void> {
    const { transferIdsToClone } = this.props;
    const { newDate } = this.state;
    if (this.state.validationResult.isValid) {
      // AFTER-REFACTOR: error handling
      this.setState({ editorBusy: true });
      await axios.post("/api/envelope-transfers/clone", { envelopeTransferIds: transferIdsToClone, date: newDate });
      this.props.onSave();
    }
  }
}

export { EnvelopeTransferCloneModal };
