import * as React from "react";
import { ReactElement, ReactNode, Component } from "react";
import axios from "axios";
import {
  IEnvelopeTransfer,
  mapEnvelopeTransferFromApi,
  DEFAULT_ENVELOPE_TRANSFER,
} from "../../../models/IEnvelopeTransfer";
import * as bs from "../../global-styles/Bootstrap.scss";
import { formatCurrencyStyled, formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { EnvelopeTransferEditModal } from "../EnvelopeTransferEditModal/EnvelopeTransferEditModal";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { Card } from "../_ui/Card/Card";
import { ControlledCheckboxInput } from "../_ui/ControlledInputs/ControlledCheckboxInput";
import { EnvelopeTransferCloneModal } from "../EnvelopeTransferCloneModal/EnvelopeTransferCloneModal";

type EnvelopeTransfersPageState = {
  readonly nonce: number;
  readonly transferToEdit?: IEnvelopeTransfer;
  readonly transferIdsToClone: string[];
  readonly transferCloneInProgress: boolean;
};

class EnvelopeTransfersPage extends Component<unknown, EnvelopeTransfersPageState> {
  private tableColumns: IColumn[] = [
    {
      title: "Date",
      sortField: "transfer.date",
      defaultSortDirection: "DESC",
      defaultSortPriority: 0,
    },
    {
      title: "From",
      sortField: "from_envelope.name",
    },
    {
      title: "To",
      sortField: "to_envelope.name",
    },
    {
      title: "Amount",
      sortField: "transfer.amount",
    },
    {
      title: "Actions",
      sortable: false,
    },
    {
      title: "Clone",
      sortable: false,
    },
  ];

  private dataProvider = new ApiDataTableDataProvider<IEnvelopeTransfer>(
    "/api/envelope-transfers/table-data",
    () => ({
      nonce: this.state.nonce,
    }),
    mapEnvelopeTransferFromApi,
  );

  constructor(props: unknown) {
    super(props);

    this.state = {
      nonce: 0,
      transferToEdit: null,
      transferIdsToClone: [],
      transferCloneInProgress: false,
    };

    this.tableRowRenderer = this.tableRowRenderer.bind(this);
    this.generateActionButtons = this.generateActionButtons.bind(this);

    this.createEnvelopeTransfer = this.createEnvelopeTransfer.bind(this);
    this.editEnvelopeTransfer = this.editEnvelopeTransfer.bind(this);
    this.deleteEnvelopeTransfer = this.deleteEnvelopeTransfer.bind(this);
    this.handleCloneCheckedChange = this.handleCloneCheckedChange.bind(this);
    this.startCloneSelectedTransfers = this.startCloneSelectedTransfers.bind(this);
  }

  public render(): ReactNode {
    const { nonce, transferToEdit, transferIdsToClone, transferCloneInProgress } = this.state;

    return (
      <>
        {transferToEdit && (
          <EnvelopeTransferEditModal
            transferToEdit={transferToEdit}
            onCancel={(): void => this.setState({ transferToEdit: null })}
            onSave={(): void => this.setState({ transferToEdit: null, nonce: new Date().getTime() })}
          />
        )}

        {transferIdsToClone.length > 0 && transferCloneInProgress && (
          <EnvelopeTransferCloneModal
            transferIdsToClone={transferIdsToClone}
            onCancel={(): void => this.setState({ transferCloneInProgress: false })}
            onSave={(): void =>
              this.setState({ transferCloneInProgress: false, transferIdsToClone: [], nonce: new Date().getTime() })
            }
          />
        )}

        <PageHeader>
          <h2>Envelope Transfers</h2>
          <PageHeaderActions>
            {transferIdsToClone.length == 0 ? null : (
              <IconBtn
                icon={"content_copy"}
                text={"Clone Selected"}
                onClick={this.startCloneSelectedTransfers}
                btnProps={{
                  className: combine(bs.btnSm, bs.btnOutlineInfo),
                }}
              />
            )}

            <KeyShortcut targetStr={"c"} onTrigger={this.createEnvelopeTransfer}>
              <IconBtn
                icon={"add"}
                text={"New Transfer"}
                onClick={this.createEnvelopeTransfer}
                btnProps={{
                  className: combine(bs.btnSm, bs.btnSuccess),
                }}
              />
            </KeyShortcut>
          </PageHeaderActions>
        </PageHeader>

        <Card>
          <DataTable<IEnvelopeTransfer>
            columns={this.tableColumns}
            dataProvider={this.dataProvider}
            watchedProps={{ nonce }}
            rowRenderer={this.tableRowRenderer}
          />
        </Card>
      </>
    );
  }

  private tableRowRenderer(transfer: IEnvelopeTransfer): ReactElement<void> {
    const { transferIdsToClone } = this.state;

    return (
      <tr key={transfer.id}>
        <td>{formatDate(transfer.date)}</td>
        <td>{transfer.fromEnvelope ? transfer.fromEnvelope.name : <i>Unallocated funds</i>}</td>
        <td>{transfer.toEnvelope ? transfer.toEnvelope.name : <i>Unallocated funds</i>}</td>
        <td>
          {formatCurrencyStyled(transfer.amount)}
          {transfer.note && (
            <span className={bs.ms2}>
              <InfoIcon hoverText={transfer.note} />
            </span>
          )}
        </td>
        <td>{this.generateActionButtons(transfer)}</td>
        <td className={bs.textCenter}>
          <ControlledCheckboxInput
            id={transfer.id}
            label={undefined}
            disabled={false}
            checked={transferIdsToClone.indexOf(transfer.id) >= 0}
            onCheckedChange={this.handleCloneCheckedChange}
          />
        </td>
      </tr>
    );
  }

  private generateActionButtons(transfer: IEnvelopeTransfer): ReactElement<void> {
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={transfer}
          onClick={this.editEnvelopeTransfer}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
        <DeleteBtn
          payload={transfer}
          onConfirmedClick={this.deleteEnvelopeTransfer}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
      </div>
    );
  }

  private createEnvelopeTransfer(): void {
    this.editEnvelopeTransfer(DEFAULT_ENVELOPE_TRANSFER);
  }

  private editEnvelopeTransfer(transferToEdit: IEnvelopeTransfer): void {
    this.setState({ transferToEdit });
  }

  private async deleteEnvelopeTransfer(transfer: IEnvelopeTransfer): Promise<void> {
    // AFTER-REFACTOR: error handling
    await axios.post(`/api/envelope-transfers/delete/${transfer.id}`);
    this.setState({ nonce: new Date().getTime() });
  }

  private handleCloneCheckedChange(checked: boolean, id: string): void {
    this.setState((oldState) => {
      let transferIdsToClone = [...oldState.transferIdsToClone];
      if (checked) {
        transferIdsToClone.push(id);
      } else {
        transferIdsToClone = transferIdsToClone.filter((i) => i != id);
      }
      return { transferIdsToClone };
    });
  }

  private startCloneSelectedTransfers(): void {
    this.setState({ transferCloneInProgress: true });
  }
}

export { EnvelopeTransfersPage };
