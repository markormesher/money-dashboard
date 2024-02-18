import * as React from "react";
import { DEFAULT_ENVELOPE, IEnvelope, mapEnvelopeFromApi } from "../../../models/IEnvelope";
import * as bs from "../../global-styles/Bootstrap.scss";
import { combine } from "../../helpers/style-helpers";
import { ApiDataTableDataProvider } from "../_ui/DataTable/DataProvider/ApiDataTableDataProvider";
import { DataTable, IColumn } from "../_ui/DataTable/DataTable";
import { DeleteBtn } from "../_ui/DeleteBtn/DeleteBtn";
import { IconBtn } from "../_ui/IconBtn/IconBtn";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { PageHeader, PageHeaderActions } from "../_ui/PageHeader/PageHeader";
import { Card } from "../_ui/Card/Card";
import { formatDate } from "../../helpers/formatters";
import { EnvelopeAllocationEditModal } from "../EnvelopeAllocationEditModal/EnvelopeAllocationEditModal";
import { useNonceState } from "../../helpers/state-hooks";
import { globalErrorManager } from "../../helpers/errors/error-manager";
import { EnvelopeApi } from "../../api/envelopes";
import {
  DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION,
  IEnvelopeAllocation,
  mapEnvelopeAllocationFromApi,
} from "../../../models/IEnvelopeAllocation";
import { EnvelopeEditModal } from "../EnvelopeEditModal/EnvelopeEditModal";

function EnvelopesPage(): React.ReactElement {
  // state
  const [nonce, updateNonce] = useNonceState();
  const [envelopeToEdit, setEnvelopeToEdit] = React.useState<IEnvelope>();
  const [envelopeAllocationToEdit, setEnvelopeAllocationToEdit] = React.useState<IEnvelopeAllocation>();

  // data tables
  const envelopeTableColumns: IColumn[] = [
    {
      title: "Name",
      sortField: "envelope.name",
      defaultSortDirection: "ASC",
    },
    {
      title: "Actions",
      sortable: false,
    },
  ];

  const envelopeDataProvider = new ApiDataTableDataProvider<IEnvelope>(
    "/api/envelopes/table-data",
    () => ({
      nonce,
    }),
    mapEnvelopeFromApi,
  );
  function envelopeTableRowRenderer(envelope: IEnvelope): React.ReactElement<void> {
    return (
      <tr key={envelope.id}>
        <td>{envelope.name}</td>
        <td>{generateEnvelopeActionButtons(envelope)}</td>
      </tr>
    );
  }

  function generateEnvelopeActionButtons(envelope: IEnvelope): React.ReactElement<void> {
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={envelope}
          onClick={editEnvelope}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />

        <DeleteBtn
          payload={envelope}
          onConfirmedClick={deleteEnvelope}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
      </div>
    );
  }

  const allocationTableColumns: IColumn[] = [
    {
      title: "Start Date",
      sortField: "allocation.startDate",
      defaultSortDirection: "DESC",
    },
    {
      title: "Allocation",
      sortField: "category.name",
      defaultSortDirection: "ASC",
    },
    {
      title: "Actions",
      sortable: false,
    },
  ];

  const allocationDataProvider = new ApiDataTableDataProvider<IEnvelopeAllocation>(
    "/api/envelope-allocations/table-data",
    () => ({
      nonce,
    }),
    mapEnvelopeAllocationFromApi,
  );

  function allocationTableRowRenderer(allocation: IEnvelopeAllocation): React.ReactElement<void> {
    return (
      <tr key={allocation.id}>
        <td>{formatDate(allocation.startDate)}</td>
        <td>
          {allocation.category.name} &rarr; {allocation.envelope.name}
        </td>
        <td>{generateAllocationActionButtons(allocation)}</td>
      </tr>
    );
  }

  function generateAllocationActionButtons(allocation: IEnvelopeAllocation): React.ReactElement<void> {
    return (
      <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
        <IconBtn
          icon={"edit"}
          text={"Edit"}
          payload={allocation}
          onClick={editEnvelopeAllocation}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />

        <DeleteBtn
          payload={allocation}
          onConfirmedClick={deleteEnvelopeAllocation}
          btnProps={{
            className: bs.btnOutlineDark,
          }}
        />
      </div>
    );
  }

  // envelope actions
  function createEnvelope(): void {
    setEnvelopeToEdit(DEFAULT_ENVELOPE);
  }

  function editEnvelope(envelope?: IEnvelope): void {
    setEnvelopeToEdit(envelope);
  }

  function onEnvelopeEditCancel(): void {
    setEnvelopeToEdit(undefined);
  }

  function onEnvelopeEditComplete(): void {
    setEnvelopeToEdit(undefined);
    updateNonce();
  }

  async function deleteEnvelope(envelope?: IEnvelope): Promise<void> {
    if (!envelope) {
      return;
    }

    try {
      await EnvelopeApi.deleteEnvelope(envelope);
      updateNonce();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to delete envelope", error);
    }
  }

  // envelopeAllocation actions
  function createEnvelopeAllocation(): void {
    setEnvelopeAllocationToEdit(DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION);
  }

  function editEnvelopeAllocation(envelopeAllocation?: IEnvelopeAllocation): void {
    setEnvelopeAllocationToEdit(envelopeAllocation);
  }

  function onEnvelopeAllocationEditCancel(): void {
    setEnvelopeAllocationToEdit(undefined);
  }

  function onEnvelopeAllocationEditComplete(): void {
    setEnvelopeAllocationToEdit(undefined);
    updateNonce();
  }

  async function deleteEnvelopeAllocation(envelopeAllocation?: IEnvelopeAllocation): Promise<void> {
    if (!envelopeAllocation) {
      return;
    }

    try {
      await EnvelopeApi.deleteEnvelopeAllocation(envelopeAllocation);
      updateNonce();
    } catch (error) {
      globalErrorManager.emitNonFatalError("Failed to delete envelope allocation", error);
    }
  }

  return (
    <>
      {envelopeToEdit ? (
        <EnvelopeEditModal
          envelopeToEdit={envelopeToEdit}
          onCancel={onEnvelopeEditCancel}
          onComplete={onEnvelopeEditComplete}
        />
      ) : null}

      {envelopeAllocationToEdit ? (
        <EnvelopeAllocationEditModal
          envelopeAllocationToEdit={envelopeAllocationToEdit}
          onCancel={onEnvelopeAllocationEditCancel}
          onComplete={onEnvelopeAllocationEditComplete}
        />
      ) : null}

      <PageHeader>
        <h2>Envelopes</h2>
        <PageHeaderActions>
          <KeyShortcut targetStr={"c"} onTrigger={createEnvelope}>
            <IconBtn
              icon={"add"}
              text={"New Envelope"}
              onClick={createEnvelope}
              btnProps={{
                className: combine(bs.btnSm, bs.btnSuccess),
              }}
            />
          </KeyShortcut>
        </PageHeaderActions>
      </PageHeader>

      <Card>
        <DataTable<IEnvelope>
          columns={envelopeTableColumns}
          dataProvider={envelopeDataProvider}
          rowRenderer={envelopeTableRowRenderer}
          watchedProps={{ nonce }}
        />
      </Card>

      <hr />

      <PageHeader>
        <h2>Envelope &harr; Category Allocations</h2>
        <PageHeaderActions>
          <IconBtn
            icon={"add"}
            text={"New Allocation"}
            onClick={createEnvelopeAllocation}
            btnProps={{
              className: combine(bs.btnSm, bs.btnSuccess),
            }}
          />
        </PageHeaderActions>
      </PageHeader>

      <Card>
        <DataTable<IEnvelopeAllocation>
          columns={allocationTableColumns}
          dataProvider={allocationDataProvider}
          rowRenderer={allocationTableRowRenderer}
          watchedProps={{ nonce }}
        />
      </Card>
    </>
  );
}

export { EnvelopesPage };
