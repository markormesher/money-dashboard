import * as React from "react";
import {
  IEnvelopeTransfer,
  mapEnvelopeTransferFromApi,
  DEFAULT_ENVELOPE_TRANSFER,
} from "../../../models/IEnvelopeTransfer";
import bs from "../../global-styles/Bootstrap.scss";
import { formatCurrencyStyled, formatDate } from "../../helpers/formatters";
import { combine } from "../../helpers/style-helpers";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, Column } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { InfoIcon } from "../_ui/InfoIcon/InfoIcon";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { EnvelopeTransferEditModal } from "../EnvelopeTransferEditModal/EnvelopeTransferEditModal";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { Card } from "../_ui/Card/Card";
import { ControlledCheckboxInput } from "../_ui/ControlledInputs/ControlledCheckboxInput";
import { EnvelopeTransferCloneModal } from "../EnvelopeTransferCloneModal/EnvelopeTransferCloneModal";
import { useNonceState } from "../../helpers/state-hooks";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { EnvelopeApi } from "../../api/envelopes";

function EnvelopeTransfersPage(): React.ReactElement {
  // state
  const [nonce, updateNonce] = useNonceState();
  const [transferToEdit, setTransferToEdit] = React.useState<IEnvelopeTransfer>();
  const [transferIdsToClone, setTransferIdsToClone] = React.useState<string[]>([]);
  const [showCloneModal, setShowCloneModal] = React.useState(false);

  // data table
  const tableColumns: Column[] = [
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

  const dataProvider = new ApiDataTableDataProvider<IEnvelopeTransfer>(
    "/api/envelope-transfers/table-data",
    () => ({ nonce }),
    mapEnvelopeTransferFromApi,
  );

  function tableRowRenderer(transfer: IEnvelopeTransfer): React.ReactElement<void> {
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
        <td>{generateActionButtons(transfer)}</td>
        <td className={bs.textCenter}>
          <ControlledCheckboxInput
            id={transfer.id}
            label={undefined}
            disabled={false}
            checked={transferIdsToClone.indexOf(transfer.id) >= 0}
            onCheckedChange={handleCloneCheckedChange}
          />
        </td>
      </tr>
    );
  }

  function generateActionButtons(transfer: IEnvelopeTransfer): React.ReactElement<void> {
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={transfer}
          onClick={editTransfer}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
        <DeleteBtn
          payload={transfer}
          onConfirmedClick={deleteTransfer}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
      </div>
    );
  }

  // actions
  function createTransfer(): void {
    setTransferToEdit(DEFAULT_ENVELOPE_TRANSFER);
  }

  function editTransfer(transfer?: IEnvelopeTransfer): void {
    setTransferToEdit(transfer);
  }

  function onEditCancel(): void {
    setTransferToEdit(undefined);
  }

  function onEditComplete(): void {
    setTransferToEdit(undefined);
    updateNonce();
  }

  function onCloneCancel(): void {
    setShowCloneModal(false);
  }

  function onCloneComplete(): void {
    setShowCloneModal(false);
    setTransferIdsToClone([]);
    updateNonce();
  }

  async function deleteTransfer(transfer?: IEnvelopeTransfer): Promise<void> {
    if (!transfer) {
      return;
    }

    try {
      await EnvelopeApi.deleteEnvelopeTransfer(transfer);
      updateNonce();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to delete envelope transfer", error);
    }
  }

  function handleCloneCheckedChange(checked: boolean, id: string): void {
    if (checked) {
      setTransferIdsToClone([...transferIdsToClone, id]);
    } else {
      setTransferIdsToClone(transferIdsToClone.filter((i) => i != id));
    }
  }

  return (
    <>
      {transferToEdit ? (
        <EnvelopeTransferEditModal
          transferToEdit={transferToEdit}
          onCancel={onEditCancel}
          onComplete={onEditComplete}
        />
      ) : null}

      {showCloneModal && transferIdsToClone.length > 0 ? (
        <EnvelopeTransferCloneModal
          transferIdsToClone={transferIdsToClone}
          onCancel={onCloneCancel}
          onComplete={onCloneComplete}
        />
      ) : null}

      <PageHeader>
        <h2>Envelope Transfers</h2>
        <PageHeaderActions>
          <IconBtn
            icon={"content_copy"}
            text={"Clone Selected"}
            onClick={() => setShowCloneModal(true)}
            btnProps={{
              className: combine(bs.btnSm, bs.btnOutlineInfo),
              disabled: transferIdsToClone.length === 0,
            }}
          />

          <KeyShortcut targetStr={"c"} onTrigger={createTransfer}>
            <IconBtn
              icon={"add"}
              text={"New Transfer"}
              onClick={createTransfer}
              btnProps={{
                className: combine(bs.btnSm, bs.btnSuccess),
              }}
            />
          </KeyShortcut>
        </PageHeaderActions>
      </PageHeader>

      <Card>
        <DataTable<IEnvelopeTransfer>
          columns={tableColumns}
          dataProvider={dataProvider}
          rowRenderer={tableRowRenderer}
          watchedProps={{ nonce }}
        />
      </Card>
    </>
  );
}

export { EnvelopeTransfersPage };
