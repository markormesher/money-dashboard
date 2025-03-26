import React, { ReactElement } from "react";
import { useNudge } from "../../utils/hooks.js";
import { toastBus } from "../toaster/toaster.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { useRouter } from "../app/router.js";
import { PageHeader } from "../page-header/page-header.js";
import { LoadingPanel } from "../common/loading/loading.js";
import { ErrorPanel } from "../common/error/error.js";
import { Tile, TileSet } from "../common/tile-set/tile-set.js";
import { copyToClipboard } from "../../utils/text.js";
import { NULL_UUID } from "../../../config/consts.js";
import { EmptyResultsPanel } from "../common/empty/empty-results.js";
import { concatClasses } from "../../utils/style.js";
import { useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { useEnvelopeAllocationList, useEnvelopeList } from "../../schema/hooks.js";
import { formatDateFromProto } from "../../utils/dates.js";
import { EnvelopeEditModal } from "./envelope-edit-modal.js";
import { EnvelopeAllocationEditModal } from "./envelope-allocation-edit-modal.js";

function EnvelopesPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Planning"], title: "Envelopes" });
  }, []);

  const [page, setPage] = React.useState("Envelopes");

  const [nudgeValue, nudge] = useNudge();
  const [error, setError] = React.useState<unknown>();

  const [searchPattern, setSearchPattern] = React.useState<RegExp>();
  const [showInactive, setShowInactive] = React.useState(false);

  const [envelopeEditingId, setEnvelopeEditingId] = React.useState<string>();
  const [envelopeAllocationEditingId, setEnvelopeAllocationEditingId] = React.useState<string>();
  useKeyShortcut("c", () => {
    if (page == "Envelopes") {
      setEnvelopeEditingId(NULL_UUID);
    } else if (page == "Envelope Allocations") {
      setEnvelopeAllocationEditingId(NULL_UUID);
    }
  });

  const envelopes = useEnvelopeList({
    dependencies: [nudgeValue],
    onError: (e) => {
      toastBus.error("Failed to load envelopes.");
      setError(e);
    },
  });

  const envelopeAllocations = useEnvelopeAllocationList({
    dependencies: [nudgeValue],
    onError: (e) => {
      toastBus.error("Failed to load envelope allocations.");
      setError(e);
    },
  });

  let pageButtons: ReactElement[] = [];
  let pageOptions: ReactElement[] = [];

  switch (page) {
    case "Envelopes":
      pageButtons = [
        <button className={"outline"} onClick={() => setEnvelopeEditingId(NULL_UUID)}>
          <IconGroup>
            <Icon name={"add"} />
            <span>New</span>
          </IconGroup>
        </button>,
      ];

      pageOptions = [
        <fieldset>
          <label>
            <input
              type={"checkbox"}
              role={"switch"}
              checked={showInactive}
              onChange={(evt) => setShowInactive(evt.target.checked)}
            />
            Show inactive
          </label>
        </fieldset>,
      ];
      break;

    case "Envelope Allocations":
      pageButtons = [
        <button className={"outline"} onClick={() => setEnvelopeAllocationEditingId(NULL_UUID)}>
          <IconGroup>
            <Icon name={"add"} />
            <span>New</span>
          </IconGroup>
        </button>,
      ];
      break;
  }

  let body: ReactElement;
  if (error) {
    body = <ErrorPanel error={error} />;
  } else if (!envelopes || !envelopeAllocations) {
    body = <LoadingPanel />;
  } else if (page == "Envelopes") {
    const filteredEnvelopes = envelopes
      .filter((a) => showInactive || a.active)
      .filter((a) => searchPattern?.test(a.name) ?? true)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (filteredEnvelopes.length == 0) {
      body = <EmptyResultsPanel pluralNoun={"envelopes"} />;
    } else {
      body = (
        <TileSet>
          {filteredEnvelopes.map((a) => {
            return (
              <Tile key={a.id} className={concatClasses(!a.active && "semi-transparent")}>
                <h4>{a.name}</h4>
                <ul className={"labels"}>{!a.active ? <li>Inactive</li> : null}</ul>
                <footer>
                  <ul className={"horizonal mb0"}>
                    <li>
                      <a href={""} className={"secondary"} onClick={() => setEnvelopeEditingId(a.id)}>
                        <IconGroup>
                          <Icon name={"edit"} />
                          <span>Edit</span>
                        </IconGroup>
                      </a>
                    </li>

                    <li>
                      <a href={""} className={"secondary"} onClick={() => copyToClipboard(a.id)}>
                        <IconGroup>
                          <Icon name={"content_copy"} />
                          <span>Copy ID</span>
                        </IconGroup>
                      </a>
                    </li>
                  </ul>
                </footer>
              </Tile>
            );
          })}
        </TileSet>
      );
    }
  } else if (page == "Envelope Allocations") {
    const filteredAllocations = envelopeAllocations
      .filter(
        (a) =>
          (searchPattern?.test(a.category?.name ?? "") ?? true) ||
          (searchPattern?.test(a.envelope?.name ?? "") ?? true),
      )
      .sort((a, b) => {
        if (a.startDate == b.startDate) {
          return a.category?.name?.localeCompare(b.category?.name ?? "") ?? 0;
        } else {
          return a.startDate < b.startDate ? 1 : -1;
        }
      });

    body = (
      <table className={"striped"}>
        <thead>
          <tr>
            <td>Start Date</td>
            <td>Category</td>
            <td>Envelope</td>
            <td>Actions</td>
          </tr>
        </thead>
        <tbody>
          {!filteredAllocations || filteredAllocations.length == 0 ? (
            <td colSpan={99}>
              <EmptyResultsPanel pluralNoun={"envelope allocations"} />
            </td>
          ) : (
            filteredAllocations.map((a) => {
              return (
                <tr>
                  <td>{formatDateFromProto(a.startDate)}</td>
                  <td>{a.category?.name}</td>
                  <td>{a.envelope?.name}</td>
                  <td className={"actions-cell"}>
                    <ul className={"horizonal mb0"}>
                      <li>
                        <a href={""} className={"secondary"} onClick={() => setEnvelopeAllocationEditingId(a.id)}>
                          <IconGroup>
                            <Icon name={"edit"} />
                            <span>Edit</span>
                          </IconGroup>
                        </a>
                      </li>
                      {/*
                      <li>
                        <a href={""} className={"secondary"} onClick={() => deleteTransaction(t.id)}>
                          <IconGroup>
                            <Icon name={"delete"} />
                            <span>{deletePending ? "Sure?" : "Delete"}</span>
                          </IconGroup>
                        </a>
                      </li>
                      */}
                    </ul>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    );
  } else {
    // we shouldn't actually get here
    body = <ErrorPanel error={"Unknown page"} />;
  }

  return (
    <>
      <div id={"content"} className={"overflow-auto"}>
        <PageHeader
          title={page}
          icon={"mail"}
          subPages={["Envelopes", "Envelope Allocations"]}
          onSubPageSelected={setPage}
          buttons={pageButtons}
          options={pageOptions}
          onSearchTextChange={(p) => setSearchPattern(p)}
        />
        <section>{body}</section>
        <hr />
        <section>
          <p>
            <IconGroup>
              <Icon name={"info"} className={"muted"} />
              <span>
                Envelopes represent amounts of money that are ear-marked for a particular purpose. Their balance is
                influenced by transfers in or out of them and by transactions in the categories that are allocated to
                them.
              </span>
            </IconGroup>
          </p>

          <p>
            <IconGroup>
              <Icon name={"info"} className={"muted"} />
              <span>
                Envelope allocations define a mapping between categories and envelopes over a given time period. When
                money is spent or earned in a category, it impacts the balance of the allocated envelope.
              </span>
            </IconGroup>
          </p>
        </section>
      </div>

      {envelopeEditingId ? (
        <EnvelopeEditModal
          envelopeId={envelopeEditingId}
          onSaveFinished={() => {
            nudge();
            setEnvelopeEditingId(undefined);
          }}
          onCancel={() => setEnvelopeEditingId(undefined)}
        />
      ) : null}

      {envelopeAllocationEditingId ? (
        <EnvelopeAllocationEditModal
          envelopeAllocationId={envelopeAllocationEditingId}
          onSaveFinished={() => {
            nudge();
            setEnvelopeAllocationEditingId(undefined);
          }}
          onCancel={() => setEnvelopeAllocationEditingId(undefined)}
        />
      ) : null}
    </>
  );
}

export { EnvelopesPage };
