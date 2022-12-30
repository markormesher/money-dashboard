import * as React from "react";
import { ReactNode, Component } from "react";
import axios from "axios";
import { IEnvelopeTransfer } from "../../../models/IEnvelopeTransfer";
import {
  IEnvelopeTransferValidationResult,
  validateEnvelopeTransfer,
} from "../../../models/validators/EnvelopeTransferValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { ControlledDateInput } from "../_ui/ControlledInputs/ControlledDateInput";
import { formatDate } from "../../helpers/formatters";
import { ControlledSelectInput } from "../_ui/ControlledInputs/ControlledSelectInput";
import { combine } from "../../helpers/style-helpers";
import { IEnvelope, mapEnvelopeFromApi } from "../../../models/IEnvelope";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { ControlledTextArea } from "../_ui/ControlledInputs/ControlledTextArea";

type EnvelopeTransferEditModalProps = {
  readonly onCancel: () => void;
  readonly onSave: () => void;
  readonly transferToEdit: IEnvelopeTransfer;
};

type EnvelopeTransferEditModalState = {
  readonly envelopeList: IEnvelope[];
  readonly editorBusy: boolean;

  readonly currentValues: IEnvelopeTransfer;
  readonly validationResult: IEnvelopeTransferValidationResult;
};

class EnvelopeTransferEditModal extends Component<EnvelopeTransferEditModalProps, EnvelopeTransferEditModalState> {
  constructor(props: EnvelopeTransferEditModalProps) {
    super(props);
    this.state = {
      envelopeList: null,
      editorBusy: false,
      currentValues: props.transferToEdit,
      validationResult: validateEnvelopeTransfer(props.transferToEdit),
    };

    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
    this.handleFromEnvelopeChange = this.handleFromEnvelopeChange.bind(this);
    this.handleToEnvelopeChange = this.handleToEnvelopeChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.updateModel = this.updateModel.bind(this);
  }

  public async componentDidMount(): Promise<void> {
    const envelopeListResponse = await axios.get("/api/envelopes/list");
    const envelopeList = (envelopeListResponse.data as IEnvelope[]).map(mapEnvelopeFromApi);
    this.setState({ envelopeList });
  }

  public render(): ReactNode {
    const { editorBusy, envelopeList, currentValues, validationResult } = this.state;
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
        title={currentValues.id ? "Edit Envelope Transfer" : "Create Envelope Transfer"}
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
                value={formatDate(currentValues.date, "system") || ""}
                disabled={editorBusy}
                error={errors.date}
                onValueChange={this.handleDateChange}
              />
            </div>
            <div className={combine(bs.col, bs.mb3)}>
              <ControlledTextInput
                id={"amount"}
                label={"Amount"}
                value={!isNaN(currentValues.amount) ? currentValues.amount : ""}
                disabled={editorBusy}
                error={errors.amount}
                onValueChange={this.handleAmountChange}
                inputProps={{
                  type: "number",
                  step: "0.01",
                  min: "0",
                }}
              />
            </div>
          </div>
          <div className={bs.row}>
            <div className={combine(bs.col, bs.mb3)}>
              <ControlledSelectInput
                id={"fromEnvelope"}
                label={"From Envelope"}
                value={currentValues.fromEnvelope ? currentValues.fromEnvelope.id : ""}
                disabled={editorBusy || !envelopeList}
                error={errors.fromEnvelope}
                onValueChange={this.handleFromEnvelopeChange}
              >
                {envelopeList && <option value={null}> Unallocated funds </option>}
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
            <div className={combine(bs.col, bs.mb3)}>
              <ControlledSelectInput
                id={"toEnvelope"}
                label={"To Envelope"}
                value={currentValues.toEnvelope ? currentValues.toEnvelope.id : ""}
                disabled={editorBusy || !envelopeList}
                error={errors.toEnvelope}
                onValueChange={this.handleToEnvelopeChange}
              >
                {envelopeList && <option value={null}>Unallocated funds</option>}
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
          <div className={bs.mb3}>
            <ControlledTextArea
              id={"note"}
              label={"Note"}
              value={currentValues.note}
              disabled={editorBusy}
              error={errors.note}
              onValueChange={this.handleNoteChange}
            />
          </div>
        </ControlledForm>
      </Modal>
    );
  }

  private handleDateChange(value: number): void {
    this.updateModel({
      date: value,
    });
  }

  private handleAmountChange(value: string): void {
    this.updateModel({ amount: parseFloat(value) });
  }

  private handleFromEnvelopeChange(value: string): void {
    const { envelopeList } = this.state;
    const selectedEnvelope = envelopeList.find((c) => c.id === value) || null;
    this.updateModel({
      fromEnvelope: selectedEnvelope,
    });
  }

  private handleToEnvelopeChange(value: string): void {
    const { envelopeList } = this.state;
    const selectedEnvelope = envelopeList.find((c) => c.id === value) || null;
    this.updateModel({
      toEnvelope: selectedEnvelope,
    });
  }

  private handleNoteChange(value: string): void {
    this.updateModel({ note: value });
  }

  private async handleSave(): Promise<void> {
    const { currentValues } = this.state;
    if (this.state.validationResult.isValid) {
      // AFTER-REFACTOR: error handling
      this.setState({ editorBusy: true });
      await axios.post(`/api/envelope-transfers/edit/${currentValues.id || ""}`, currentValues);
      this.props.onSave();
    }
  }

  private updateModel(envelope: Partial<IEnvelopeTransfer>): void {
    const updatedEnvelopeTransfer = {
      ...this.state.currentValues,
      ...envelope,
    };
    this.setState({
      currentValues: updatedEnvelopeTransfer,
      validationResult: validateEnvelopeTransfer(updatedEnvelopeTransfer),
    });
  }
}

export { EnvelopeTransferEditModal };
