import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import { IEnvelope, DEFAULT_ENVELOPE } from "../../../models/IEnvelope";
import { IEnvelopeValidationResult, validateEnvelope } from "../../../models/validators/EnvelopeValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { setEnvelopeToEdit, startSaveEnvelope } from "../../redux/envelopes";
import { IRootState } from "../../redux/root";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { ControlledTextInput } from "../_ui/ControlledInputs/ControlledTextInput";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";

interface IEnvelopeEditModalProps {
  readonly envelopeToEdit?: IEnvelope;
  readonly editorBusy?: boolean;

  readonly actions?: {
    readonly setEnvelopeToEdit: (envelope: IEnvelope) => AnyAction;
    readonly startSaveEnvelope: (envelope: Partial<IEnvelope>) => AnyAction;
  };
}

interface IEnvelopeEditModalState {
  readonly currentValues: IEnvelope;
  readonly validationResult: IEnvelopeValidationResult;
}

function mapStateToProps(state: IRootState, props: IEnvelopeEditModalProps): IEnvelopeEditModalProps {
  return {
    ...props,
    envelopeToEdit: state.envelopes.envelopeToEdit,
    editorBusy: state.envelopes.envelopeEditorBusy,
  };
}

function mapDispatchToProps(dispatch: Dispatch, props: IEnvelopeEditModalProps): IEnvelopeEditModalProps {
  return {
    ...props,
    actions: {
      setEnvelopeToEdit: (envelope): AnyAction => dispatch(setEnvelopeToEdit(envelope)),
      startSaveEnvelope: (envelope): AnyAction => dispatch(startSaveEnvelope(envelope)),
    },
  };
}

class UCEnvelopeEditModal extends PureComponent<IEnvelopeEditModalProps, IEnvelopeEditModalState> {
  constructor(props: IEnvelopeEditModalProps) {
    super(props);
    const envelopeToEdit = props.envelopeToEdit || DEFAULT_ENVELOPE;
    this.state = {
      currentValues: envelopeToEdit,
      validationResult: validateEnvelope(envelopeToEdit),
    };

    this.handleNameChange = this.handleNameChange.bind(this);
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

    return (
      <Modal
        title={currentValues.id ? "Edit Envelope" : "Create Envelope"}
        buttons={modalBtns}
        modalBusy={editorBusy}
        onCloseRequest={this.handleCancel}
      >
        <ControlledForm onSubmit={this.handleSave}>
          <div className={bs.mb3}>
            <ControlledTextInput
              id={"name"}
              label={"Name"}
              placeholder={"Envelope Name"}
              value={currentValues.name}
              onValueChange={this.handleNameChange}
              disabled={editorBusy}
              error={errors.name}
              inputProps={{
                autoFocus: true,
              }}
            />
          </div>
        </ControlledForm>
      </Modal>
    );
  }

  private handleNameChange(value: string): void {
    this.updateModel({ name: value });
  }

  private handleSave(): void {
    if (this.state.validationResult.isValid) {
      this.props.actions.startSaveEnvelope(this.state.currentValues);
    }
  }

  private handleCancel(): void {
    this.props.actions.setEnvelopeToEdit(undefined);
  }

  private updateModel(envelope: Partial<IEnvelope>): void {
    const updatedEnvelope = {
      ...this.state.currentValues,
      ...envelope,
    };
    this.setState({
      currentValues: updatedEnvelope,
      validationResult: validateEnvelope(updatedEnvelope),
    });
  }
}

export const EnvelopeEditModal = connect(mapStateToProps, mapDispatchToProps)(UCEnvelopeEditModal);
