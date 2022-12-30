import * as React from "react";
import { ReactElement, ReactNode, Component } from "react";
import { tr } from "date-fns/locale";
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

/*
 * NOTE: this component works very differently to the other components (i.e. gets rid of most of the Redux nonsense).
 * The app will gradually be re-written to get rid of some of the over-use of Redux. This component is the first to be written
 * like this because there was no point writing it in the old style only to re-write it shortly after.
 */

type EnvelopeTransfersPageState = {
  readonly nonce: number;
  readonly transferToEdit?: IEnvelopeTransfer;
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
    };

    this.tableRowRenderer = this.tableRowRenderer.bind(this);
    this.generateActionButtons = this.generateActionButtons.bind(this);
    this.createEnvelopeTransfer = this.createEnvelopeTransfer.bind(this);
    this.editEnvelopeTransfer = this.editEnvelopeTransfer.bind(this);
    this.deleteEnvelopeTransfer = this.deleteEnvelopeTransfer.bind(this);
  }

  public render(): ReactNode {
    const { nonce, transferToEdit } = this.state;

    return (
      <>
        {transferToEdit && (
          <EnvelopeTransferEditModal
            transferToEdit={transferToEdit}
            onCancel={(): void => this.setState({ transferToEdit: null })}
            onSave={(): void => this.setState({ transferToEdit: null, nonce: new Date().getTime() })}
          />
        )}

        <PageHeader>
          <h2>EnvelopeTransfers</h2>
          <PageHeaderActions>
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
    return (
      <tr key={transfer.id}>
        <td>{formatDate(transfer.date)}</td>
        <td>
          {transfer.fromEnvelope ? transfer.fromEnvelope.name : <i>Unallocated funds</i>}
          {transfer.note && (
            <span className={bs.ms2}>
              <InfoIcon hoverText={transfer.note} />
            </span>
          )}
        </td>
        <td>{transfer.toEnvelope ? transfer.toEnvelope.name : <i>Unallocated funds</i>}</td>
        <td>{formatCurrencyStyled(transfer.amount)}</td>
        <td>{this.generateActionButtons(transfer)}</td>
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
}

export { EnvelopeTransfersPage };
