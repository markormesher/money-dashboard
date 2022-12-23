import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import {
  ICategoryToEnvelopeAllocation,
  DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION,
} from "../../../models/ICategoryToEnvelopeAllocation";
import {
  ICategoryToEnvelopeAllocationValidationResult,
  validateEnvelopeAllocation,
} from "../../../models/validators/CategoryToEnvelopeAllocationValidator";
import * as bs from "../../global-styles/Bootstrap.scss";
import { setAllocationToEdit, startSaveAllocation, startLoadEnvelopeList } from "../../redux/envelopes";
import { IRootState } from "../../redux/root";
import { ControlledForm } from "../_ui/ControlledForm/ControlledForm";
import { IModalBtn, Modal, ModalBtnType } from "../_ui/Modal/Modal";
import { ControlledDateInput } from "../_ui/ControlledInputs/ControlledDateInput";
import { formatDate } from "../../helpers/formatters";
import { ControlledSelectInput } from "../_ui/ControlledInputs/ControlledSelectInput";
import { combine } from "../../helpers/style-helpers";
import { IEnvelope } from "../../../models/IEnvelope";
import { ICategory } from "../../../models/ICategory";
import { startLoadCategoryList } from "../../redux/categories";

interface IEnvelopeAllocationEditModalProps {
  readonly allocationToEdit?: ICategoryToEnvelopeAllocation;
  readonly editorBusy?: boolean;
  readonly categoryList?: ICategory[];
  readonly envelopeList?: IEnvelope[];

  readonly actions?: {
    readonly setAllocationToEdit: (envelope: ICategoryToEnvelopeAllocation) => AnyAction;
    readonly startSaveAllocation: (envelope: Partial<ICategoryToEnvelopeAllocation>) => AnyAction;
    readonly startLoadCategoryList: () => AnyAction;
    readonly startLoadEnvelopeList: () => AnyAction;
  };
}

interface IEnvelopeAllocationEditModalState {
  readonly currentValues: ICategoryToEnvelopeAllocation;
  readonly validationResult: ICategoryToEnvelopeAllocationValidationResult;
}

function mapStateToProps(
  state: IRootState,
  props: IEnvelopeAllocationEditModalProps,
): IEnvelopeAllocationEditModalProps {
  return {
    ...props,
    allocationToEdit: state.envelopes.allocationToEdit,
    editorBusy: state.envelopes.envelopeEditorBusy,
    categoryList: state.categories.categoryList,
    envelopeList: state.envelopes.envelopeList,
  };
}

function mapDispatchToProps(
  dispatch: Dispatch,
  props: IEnvelopeAllocationEditModalProps,
): IEnvelopeAllocationEditModalProps {
  return {
    ...props,
    actions: {
      setAllocationToEdit: (envelope): AnyAction => dispatch(setAllocationToEdit(envelope)),
      startSaveAllocation: (envelope): AnyAction => dispatch(startSaveAllocation(envelope)),
      startLoadCategoryList: (): AnyAction => dispatch(startLoadCategoryList()),
      startLoadEnvelopeList: (): AnyAction => dispatch(startLoadEnvelopeList()),
    },
  };
}

class UCEnvelopeAllocationEditModal extends PureComponent<
  IEnvelopeAllocationEditModalProps,
  IEnvelopeAllocationEditModalState
> {
  constructor(props: IEnvelopeAllocationEditModalProps) {
    super(props);
    const allocationToEdit = props.allocationToEdit || DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION;
    this.state = {
      currentValues: allocationToEdit,
      validationResult: validateEnvelopeAllocation(allocationToEdit),
    };

    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleEnvelopeChange = this.handleEnvelopeChange.bind(this);

    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.updateModel = this.updateModel.bind(this);
  }

  public componentDidMount(): void {
    this.props.actions.startLoadCategoryList();
    this.props.actions.startLoadEnvelopeList();
  }

  public render(): ReactNode {
    const { editorBusy, categoryList, envelopeList } = this.props;
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
        title={currentValues.id ? "Edit Envelope Allocation" : "Create Envelope Allocation"}
        buttons={modalBtns}
        modalBusy={editorBusy}
        onCloseRequest={this.handleCancel}
      >
        <ControlledForm onSubmit={this.handleSave}>
          <div className={bs.mb3}>
            <ControlledDateInput
              id={"startDate"}
              label={"Start Date"}
              value={formatDate(currentValues.startDate, "system") || ""}
              disabled={editorBusy}
              error={errors.startDate}
              onValueChange={this.handleStartDateChange}
            />
          </div>
          <div className={bs.row}>
            <div className={combine(bs.col, bs.mb3)}>
              <ControlledSelectInput
                id={"category"}
                label={"Category"}
                value={currentValues.category ? currentValues.category.id : ""}
                disabled={editorBusy || !categoryList}
                error={errors.category}
                onValueChange={this.handleCategoryChange}
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
              <ControlledSelectInput
                id={"envelope"}
                label={"Envelope"}
                value={currentValues.envelope ? currentValues.envelope.id : ""}
                disabled={editorBusy || !envelopeList}
                error={errors.envelope}
                onValueChange={this.handleEnvelopeChange}
              >
                {envelopeList && <option value={""}>-- Select --</option>}
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
        </ControlledForm>
      </Modal>
    );
  }

  private handleStartDateChange(value: number): void {
    this.updateModel({
      startDate: value,
    });
  }

  private handleCategoryChange(value: string): void {
    const { categoryList } = this.props;
    const selectedCategory = categoryList.find((c) => c.id === value);
    this.updateModel({
      category: selectedCategory,
    });
  }

  private handleEnvelopeChange(value: string): void {
    const { envelopeList } = this.props;
    const selectedEnvelope = envelopeList.find((c) => c.id === value);
    this.updateModel({
      envelope: selectedEnvelope,
    });
  }

  private handleSave(): void {
    if (this.state.validationResult.isValid) {
      this.props.actions.startSaveAllocation(this.state.currentValues);
    }
  }

  private handleCancel(): void {
    this.props.actions.setAllocationToEdit(undefined);
  }

  private updateModel(envelope: Partial<ICategoryToEnvelopeAllocation>): void {
    const updatedEnvelopeAllocation = {
      ...this.state.currentValues,
      ...envelope,
    };
    this.setState({
      currentValues: updatedEnvelopeAllocation,
      validationResult: validateEnvelopeAllocation(updatedEnvelopeAllocation),
    });
  }
}

export const EnvelopeAllocationEditModal = connect(mapStateToProps, mapDispatchToProps)(UCEnvelopeAllocationEditModal);
