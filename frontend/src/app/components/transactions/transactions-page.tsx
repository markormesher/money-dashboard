import React, { ReactElement } from "react";
import { Transaction } from "../../../api_gen/moneydashboard/v4/transactions_pb.js";
import { useAsyncEffect, useNudge } from "../../utils/hooks.js";
import { toastBus } from "../toaster/toaster.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { useRouter } from "../app/router.js";
import { PageHeader } from "../page-header/page-header.js";
import { LoadingPanel } from "../common/loading/loading.js";
import { ErrorPanel } from "../common/error/error.js";
import { GBP_CURRENCY_ID, NULL_UUID } from "../../../config/consts.js";
import { transactionServiceClient } from "../../../api/api.js";
import { formatDateFromProto } from "../../utils/dates.js";
import { formatCurrencyValue } from "../../utils/currency.js";
import { formatAssetQuantity } from "../../utils/assets.js";
import { concatClasses } from "../../utils/style.js";
import { useHoldingList } from "../../schema/hooks.js";
import { EmptyResultsPanel } from "../common/empty/empty-results.js";
import { useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { TransactionEditModal } from "./transaction-edit-modal.js";

const PER_PAGE = 20;

function TransactionsPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: [], title: "Transactions" });
  }, []);

  const [nudgeValue, nudge] = useNudge();
  const [error, setError] = React.useState<unknown>();

  const [searchPattern, setSearchPattern] = React.useState<RegExp>();
  const [page, setPage] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [filteredTotal, setFilteredTotal] = React.useState(0);
  const [pageCount, setPageCount] = React.useState(1);
  const [transactions, setTransactions] = React.useState<Transaction[]>();

  const [editingId, setEditingId] = React.useState<string>();
  useKeyShortcut("c", () => setEditingId(NULL_UUID));

  const [deletePendingId, setDeletePendingId] = React.useState<string>();
  const clearDeletePendingId = React.useRef<number>(null);

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
      const res = await transactionServiceClient.getTransactionPage({
        page,
        perPage: PER_PAGE,
        searchPattern: searchPattern?.toString()?.replace(/^\/(.*)\/i/, "$1") ?? "",
      });
      setTotal(res.total);
      setFilteredTotal(res.filteredTotal);
      setTransactions(res.filteredEntities);

      const pageCount = Math.max(Math.ceil(res.filteredTotal / PER_PAGE), 1);
      setPageCount(pageCount);
      setPage(Math.min(page, pageCount));
    } catch (e) {
      toastBus.error("Failed to load transactions.");
      setError(e);
      console.log(e);
    }
  }, [nudgeValue, page, searchPattern]);

  const deleteTransaction = (id: string) => {
    if (deletePendingId != id) {
      setDeletePendingId(id);
      if (clearDeletePendingId.current) {
        clearTimeout(clearDeletePendingId.current);
      }
      clearDeletePendingId.current = window.setTimeout(() => setDeletePendingId(undefined), 2000);
    } else {
      transactionServiceClient
        .deleteTransaction({ id })
        .then(() => {
          toastBus.success("Deleted transaction.");
          nudge();
        })
        .catch((e) => {
          toastBus.error("Failed to delete transaction.");
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
  } else if (!transactions || !holdingsPerAccount) {
    body = <LoadingPanel />;
  } else {
    body = (
      <>
        <table className={"striped"}>
          <thead>
            <tr>
              <td>Date</td>
              <td>Account / Holding</td>
              <td>Payee</td>
              <td>Category</td>
              <td>Amount</td>
              <td>Actions</td>
            </tr>
          </thead>
          <tbody>
            {!transactions || transactions.length == 0 ? (
              <td colSpan={99}>
                <EmptyResultsPanel pluralNoun={"transactions"} />
              </td>
            ) : (
              transactions?.map((t, i, arr) => {
                let amount = "";
                let amountPrefix = "";
                if (t.holding?.currency) {
                  amount = formatCurrencyValue(t.amount, t.holding.currency);
                  if (t.holding.currency.id != GBP_CURRENCY_ID) {
                    amountPrefix = t.holding.currency.symbol + t.holding.currency.code;
                  }
                } else if (t.holding?.asset) {
                  amount = formatAssetQuantity(t.amount);
                  amountPrefix = t.holding.asset.name;
                }

                const qtyAccountHoldings = holdingsPerAccount[t.holding?.account?.id ?? ""] ?? 999;

                const deletePending = deletePendingId == t.id;

                const newDate = i == 0 || arr[i - 1]?.date != t.date;

                return (
                  <tr>
                    <td>
                      <span className={concatClasses(!newDate && "muted")}>{formatDateFromProto(t.date)}</span>
                    </td>
                    <td className={"holding-cell"}>
                      {qtyAccountHoldings > 1 ? (
                        <>
                          <span>{t.holding?.account?.name}</span>
                          <span className={"separator"}>&#x2022;</span>
                          <span>{t.holding?.name}</span>
                        </>
                      ) : (
                        <span>{t.holding?.account?.name}</span>
                      )}
                    </td>
                    <td className={concatClasses(t.payee == "N/A" && "muted")}>
                      {t.notes.length > 0 ? (
                        <IconGroup>
                          <span>{t.payee}</span>
                          <span data-tooltip={t.notes}>
                            <Icon name={"info"} className={"muted"} />
                          </span>
                        </IconGroup>
                      ) : (
                        t.payee
                      )}
                    </td>
                    <td>{t.category?.name}</td>
                    <td className={"amount-cell"}>
                      {amountPrefix != "" ? <span className={"amount-prefix"}>{amountPrefix}</span> : null}
                      <span className={"amount"}>{amount}</span>
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
                          <a href={""} className={"secondary"} onClick={() => deleteTransaction(t.id)}>
                            <IconGroup>
                              <Icon name={"delete"} />
                              <span>{deletePending ? "Sure?" : "Delete"}</span>
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
          title={"Transactions"}
          icon={"list"}
          buttons={pageButtons}
          options={pageOptions}
          onSearchTextChange={(p) => setSearchPattern(p)}
        />
        <section>{body}</section>
      </div>

      {editingId ? (
        <TransactionEditModal
          transactionId={editingId}
          onCreateFinished={() => {
            nudge();
          }}
          onEditFinished={() => {
            nudge();
            setEditingId(undefined);
          }}
          onCancel={() => setEditingId(undefined)}
        />
      ) : null}
    </>
  );
}

export { TransactionsPage };
