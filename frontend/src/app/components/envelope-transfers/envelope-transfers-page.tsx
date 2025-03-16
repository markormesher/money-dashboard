import React, { ReactElement } from "react";
import { useAsyncEffect, useNudge } from "../../utils/hooks.js";
import { toastBus } from "../toaster/toaster.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { useRouter } from "../app/router.js";
import { PageHeader } from "../page-header/page-header.js";
import { LoadingPanel } from "../common/loading/loading.js";
import { ErrorPanel } from "../common/error/error.js";
import { NULL_UUID } from "../../../config/consts.js";
import { formatDateFromProto } from "../../utils/dates.js";
import { formatCurrency } from "../../utils/currency.js";
import { useHoldingList } from "../../schema/hooks.js";
import { EmptyResultsPanel } from "../common/empty/empty-results.js";
import { useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { EnvelopeTransfer } from "../../../api_gen/moneydashboard/v4/envelope_transfers_pb.js";
import { envelopeTransferServiceClient } from "../../../api/api.js";
import { concatClasses } from "../../utils/style.js";
import { EnvelopeTransferEditModal } from "./envelope-transfer-edit-modal.js";
import { EnvelopeTransferCloneModal } from "./envelope-transfer-clone-modal.js";

const PER_PAGE = 20;

function EnvelopeTransfersPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: [], title: "Envelope Transfers" });
  }, []);

  const [nudgeValue, nudge] = useNudge();
  const [error, setError] = React.useState<unknown>();

  const [searchPattern, setSearchPattern] = React.useState<RegExp>();
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [filteredTotal, setFilteredTotal] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(1);
  const [envelopeTransfers, setEnvelopeTransfers] = React.useState<EnvelopeTransfer[]>();

  const [editingId, setEditingId] = React.useState<string>();
  useKeyShortcut("c", () => setEditingId(NULL_UUID));

  const [deletePendingId, setDeletePendingId] = React.useState<string>();
  const clearDeletePendingId = React.useRef<number>(null);

  const [cloneModalOpen, setCloneModalOpen] = React.useState(false);
  const [clonePendingIds, setClonePendingIds] = React.useState<string[]>([]);
  const toggleClonePending = (id: string) => {
    if (clonePendingIds.includes(id)) {
      setClonePendingIds(clonePendingIds.filter((a) => a != id));
    } else {
      setClonePendingIds([...clonePendingIds, id]);
    }
  };

  const holdings = useHoldingList({ onError: (e) => setError(e) });
  const [holdingsPerAccount, setHoldingsPerAccount] = React.useState<Record<string, number>>();
  React.useEffect(() => {
    if (!holdings) {
      return;
    }

    const hpa: Record<string, number> = {};
    holdings.forEach((h) => {
      hpa[h.account?.id ?? ""] = (hpa[h.account?.id ?? ""] ?? 0) + 1;
    });
    setHoldingsPerAccount(hpa);
  }, [holdings]);

  useAsyncEffect(async () => {
    try {
      const res = await envelopeTransferServiceClient.getEnvelopeTransferPage({
        page,
        perPage: PER_PAGE,
        searchPattern: searchPattern?.toString()?.replace(/^\/(.*)\/i/, "$1") ?? "",
      });
      setTotal(res.total);
      setFilteredTotal(res.filteredTotal);
      setEnvelopeTransfers(res.filteredEntities);

      const pageCount = Math.max(Math.ceil(res.filteredTotal / PER_PAGE), 1);
      setPageCount(pageCount);
      setPage(Math.min(page, pageCount));
    } catch (e) {
      toastBus.error("Failed to load envelopeTransfers.");
      setError(e);
      console.log(e);
    }
  }, [nudgeValue, page, searchPattern]);

  const deleteEnvelopeTransfer = (id: string) => {
    if (deletePendingId != id) {
      setDeletePendingId(id);
      if (clearDeletePendingId.current) {
        clearTimeout(clearDeletePendingId.current);
      }
      clearDeletePendingId.current = window.setTimeout(() => setDeletePendingId(undefined), 2000);
    } else {
      envelopeTransferServiceClient
        .deleteEnvelopeTransfer({ id })
        .then(() => {
          toastBus.success("Deleted envelope transfer.");
          nudge();
        })
        .catch((e) => {
          toastBus.error("Failed to delete envelope transfer.");
          console.log(e);
        });
    }
  };

  const pageButtons = [
    <button className={"outline"} onClick={() => setEditingId(NULL_UUID)}>
      <IconGroup>
        <Icon name={"add"} />
        <span>New</span>
      </IconGroup>
    </button>,
    <button className={"outline"} onClick={() => setCloneModalOpen(true)} disabled={clonePendingIds.length == 0}>
      <IconGroup>
        <Icon name={"content_copy"} />
        <span>{clonePendingIds.length == 0 ? "Clone Selected" : `Clone ${clonePendingIds.length} Selected`}</span>
      </IconGroup>
    </button>,
  ];

  const pageOptions = [
    <fieldset role={"group"}>
      <button className={"outline"} onClick={() => setPage((curr) => Math.max(1, curr - 1))} disabled={page == 1}>
        <Icon name={"arrow_back"} />
      </button>
      <button className={"outline"}>
        <span className={"muted"}>
          Page {page} of {pageCount}
        </span>
      </button>
      <button
        className={"outline"}
        onClick={() => setPage((curr) => Math.min(pageCount, curr + 1))}
        disabled={page >= pageCount}
      >
        <Icon name={"arrow_forward"} />
      </button>
    </fieldset>,
  ];

  let body: ReactElement;
  if (error) {
    body = <ErrorPanel error={error} />;
  } else if (!envelopeTransfers || !holdingsPerAccount) {
    body = <LoadingPanel />;
  } else {
    body = (
      <>
        <table className={"striped"}>
          <thead>
            <tr>
              <td>Date</td>
              <td>From Envelope</td>
              <td>To Envelope</td>
              <td>Amount</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {!envelopeTransfers || envelopeTransfers.length == 0 ? (
              <td colSpan={99}>
                <EmptyResultsPanel pluralNoun={"envelope transfers"} />
              </td>
            ) : (
              envelopeTransfers?.map((t, i, arr) => {
                const deletePending = deletePendingId == t.id;
                const clonePending = clonePendingIds.includes(t.id);
                const newDate = i == 0 || arr[i - 1]?.date != t.date;

                return (
                  <tr>
                    <td>
                      <span className={concatClasses(!newDate && "muted")}>{formatDateFromProto(t.date)}</span>
                    </td>
                    <td>{t.fromEnvelope?.name ?? <em>Unallocated funds</em>}</td>
                    <td>
                      {t.notes.length > 0 ? (
                        <IconGroup>
                          <span>{t.toEnvelope?.name ?? <em>Unallocated funds</em>}</span>
                          <span data-tooltip={t.notes}>
                            <Icon name={"info"} className={"muted"} />
                          </span>
                        </IconGroup>
                      ) : (
                        <>{t.toEnvelope?.name ?? <em>Unallocated funds</em>}</>
                      )}
                    </td>
                    <td className={"amount-cell"}>
                      <span className={"amount"}>{formatCurrency(t.amount, null)}</span>
                    </td>
                    <td className={"actions-cell"}>
                      <ul className={"horizonal mb0"}>
                        <li>
                          <a href={""} className={"secondary"} onClick={() => setEditingId(t.id)}>
                            <IconGroup>
                              <Icon name={"edit"} />
                              <span>Edit</span>
                            </IconGroup>
                          </a>
                        </li>
                        <li>
                          <a href={""} className={"secondary"} onClick={() => deleteEnvelopeTransfer(t.id)}>
                            <IconGroup>
                              <Icon name={"delete"} />
                              <span>{deletePending ? "Sure?" : "Delete"}</span>
                            </IconGroup>
                          </a>
                        </li>
                        <li>
                          <a href={""} className={"secondary"} onClick={() => toggleClonePending(t.id)}>
                            <IconGroup>
                              <Icon name={clonePending ? "check_box" : "check_box_outline_blank"} />
                              <span>Clone</span>
                            </IconGroup>
                          </a>
                        </li>
                      </ul>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <small className={"muted"}>
          Showing rows {PER_PAGE * (page - 1) + 1} of {Math.min(filteredTotal, PER_PAGE * page)} of{" "}
          {filteredTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          {filteredTotal != total
            ? ` (filtered from ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })} total)`
            : ""}
          .
        </small>
      </>
    );
  }

  return (
    <>
      <div id={"content"} className={"overflow-auto"}>
        <PageHeader
          title={"Envelope Transfers"}
          icon={"swap_horiz"}
          buttons={pageButtons}
          options={pageOptions}
          onSearchTextChange={(p) => setSearchPattern(p)}
        />
        <section>{body}</section>
      </div>

      {editingId ? (
        <EnvelopeTransferEditModal
          envelopeTransferId={editingId}
          onSaveFinished={() => {
            nudge();
            setEditingId(undefined);
          }}
          onCancel={() => setEditingId(undefined)}
        />
      ) : null}

      {clonePendingIds.length > 0 && cloneModalOpen ? (
        <EnvelopeTransferCloneModal
          envelopeTransferIds={clonePendingIds}
          onSaveFinished={() => {
            nudge();
            setClonePendingIds([]);
            setCloneModalOpen(false);
          }}
          onCancel={() => setCloneModalOpen(false)}
        />
      ) : null}
    </>
  );
}

export { EnvelopeTransfersPage };
