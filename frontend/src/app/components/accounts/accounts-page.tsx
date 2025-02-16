import React, { ReactElement } from "react";
import { Account } from "../../../api_gen/moneydashboard/v4/accounts_pb.js";
import { useAsyncEffect, useKeyShortcut, useNudge } from "../../utils/hooks.js";
import { toastBus } from "../toaster/toaster.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { useRouter } from "../app/router.js";
import { PageHeader } from "../page-header/page-header.js";
import { LoadingPanel } from "../common/loading/loading.js";
import { ErrorPanel } from "../common/error/error.js";
import { Tile, TileSet } from "../common/tile-set/tile-set.js";
import { copyToClipboard, safeNewRegex } from "../../utils/text.js";
import { NULL_UUID } from "../../../config/consts.js";
import { EmptyResultsPanel } from "../common/empty/empty-results.js";
import { accountServiceClient } from "../../../api/api.js";
import { concatClasses } from "../../utils/style.js";
import { AccountEditModal } from "./account-edit-modal.js";

function AccountsPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Metadata"], title: "Accounts" });
  }, []);

  const [nudgeValue, nudge] = useNudge();
  const [error, setError] = React.useState<unknown>();
  const [accounts, setAccounts] = React.useState<Account[]>();

  const [searchString, setSearchString] = React.useState("");
  const [showInactive, setShowInactive] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string>();
  useKeyShortcut({ targetStr: "c", onTrigger: () => setEditingId(NULL_UUID) });

  useAsyncEffect(async () => {
    try {
      const res = await accountServiceClient.getAllAccounts({});
      setAccounts(res.accounts);
    } catch (e) {
      toastBus.error("Failed to load accounts.");
      setError(e);
      console.log(e);
    }
  }, [nudgeValue]);

  const pageButtons = [
    <button className={"outline"} onClick={() => setEditingId(NULL_UUID)}>
      <IconGroup>
        <Icon name={"add"} />
        <span>New</span>
      </IconGroup>
    </button>,
  ];

  const pageOptions = (
    <>
      <fieldset>
        <input
          type={"text"}
          placeholder={"Search"}
          value={searchString}
          onChange={(evt) => setSearchString(evt.target.value)}
        />
      </fieldset>

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
      </fieldset>
    </>
  );

  let body: ReactElement;
  if (error) {
    body = <ErrorPanel error={error} />;
  } else if (!accounts) {
    body = <LoadingPanel />;
  } else {
    const searchRegex = safeNewRegex(searchString);
    const filteredAccounts = accounts
      .filter((a) => showInactive || a.active)
      .filter((a) => searchRegex?.test(a.name) ?? true)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (filteredAccounts.length == 0) {
      body = <EmptyResultsPanel pluralNoun={"accounts"} />;
    } else {
      body = (
        <TileSet>
          {filteredAccounts.map((c) => {
            return (
              <Tile key={c.id} className={concatClasses(!c.active && "semi-transparent")}>
                <h4>{c.name}</h4>
                <ul className={"labels"}>
                  {!c.active ? <li>Inactive</li> : null}
                  {c.isIsa ? <li>ISA</li> : null}
                  {c.isPension ? <li>Pension</li> : null}
                  {c.excludeFromEnvelopes ? <li>Excluded from envelopes</li> : null}
                </ul>
                <footer>
                  <ul className={"horizonal mb0"}>
                    <li>
                      <a href={""} className={"secondary"} onClick={() => setEditingId(c.id)}>
                        <IconGroup>
                          <Icon name={"edit"} />
                          <span>Edit</span>
                        </IconGroup>
                      </a>
                    </li>

                    <li>
                      <a href={""} className={"secondary"} onClick={() => copyToClipboard(c.id)}>
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
  }

  return (
    <>
      <div id={"content"} className={"overflow-auto"}>
        <PageHeader
          title={"Accounts"}
          icon={"account_balance"}
          buttons={pageButtons}
          options={pageOptions}
          optionsStartOpen={true}
        />
        <hr />
        <section>{body}</section>
        <hr />
        <section>
          <p>
            <IconGroup>
              <Icon name={"info"} className={"muted"} />
              <span>
                Accounts are a wrapper around a collection of one or more <a href={"/records/holdings"}>holdings</a>;
                usually 1:1 with an actual account held at a financial institution.
              </span>
            </IconGroup>
          </p>
        </section>
      </div>

      {editingId ? (
        <AccountEditModal
          accountId={editingId}
          onSaveFinished={() => {
            nudge();
            setEditingId(undefined);
          }}
          onCancel={() => setEditingId(undefined)}
        />
      ) : null}
    </>
  );
}

export { AccountsPage };
