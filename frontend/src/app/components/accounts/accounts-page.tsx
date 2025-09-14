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
import { useAccountGroupList, useAccountList } from "../../schema/hooks.js";
import { AccountEditModal } from "./account-edit-modal.js";
import { AccountGroupEditModal } from "./account-group-edit-modal.js";

function AccountsPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Settings"], title: "Accounts" });
  }, []);

  const [page, setPage] = React.useState("Accounts");

  const [nudgeValue, nudge] = useNudge();
  const [error, setError] = React.useState<unknown>();

  const [searchPattern, setSearchPattern] = React.useState<RegExp>();
  const [showInactive, setShowInactive] = React.useState(false);

  const [accountEditingId, setAccountEditingId] = React.useState<string>();
  const [accountGroupEditingId, setAccountGroupEditingId] = React.useState<string>();
  useKeyShortcut("c", () => {
    if (page == "Accounts") {
      setAccountEditingId(NULL_UUID);
    } else if (page == "Account Groups") {
      setAccountGroupEditingId(NULL_UUID);
    }
  });

  const accounts = useAccountList({
    dependencies: [nudgeValue],
    onError: (e) => {
      toastBus.error("Failed to load accounts.");
      setError(e);
    },
  });

  const accountGroups = useAccountGroupList({
    dependencies: [nudgeValue],
    onError: (e) => {
      toastBus.error("Failed to load account groups.");
      setError(e);
    },
  });

  let pageButtons: ReactElement[] = [];
  let pageOptions: ReactElement[] = [];

  switch (page) {
    case "Accounts":
      pageButtons = [
        <button className={"outline"} onClick={() => setAccountEditingId(NULL_UUID)}>
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

    case "Account Groups":
      pageButtons = [
        <button className={"outline"} onClick={() => setAccountGroupEditingId(NULL_UUID)}>
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
  } else if (!accounts || !accountGroups) {
    body = <LoadingPanel />;
  } else if (page == "Accounts") {
    const filteredAccounts = accounts
      .filter((a) => showInactive || a.active)
      .filter((a) => searchPattern?.test(a.name) ?? true)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (filteredAccounts.length == 0) {
      body = <EmptyResultsPanel pluralNoun={"accounts"} />;
    } else {
      body = (
        <TileSet>
          {filteredAccounts.map((a) => {
            return (
              <Tile key={a.id} className={concatClasses(!a.active && "semi-transparent")}>
                <h4>{a.name}</h4>
                <ul className={"labels"}>
                  <li>{a.accountGroup?.name}</li>
                  {!a.active ? <li>Inactive</li> : null}
                  {a.isIsa ? <li>ISA</li> : null}
                  {a.isPension ? <li>Pension</li> : null}
                  {a.excludeFromEnvelopes ? <li>Excluded from envelopes</li> : null}
                  {a.excludeFromReports ? <li>Excluded from reports</li> : null}
                </ul>
                {!!a.notes ? <small>{a.notes}</small> : null}
                <footer>
                  <ul className={"horizonal mb0"}>
                    <li>
                      <a href={""} className={"secondary"} onClick={() => setAccountEditingId(a.id)}>
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
  } else if (page == "Account Groups") {
    const filteredGroups = accountGroups
      .filter((g) => searchPattern?.test(g.name) ?? true)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    if (filteredGroups.length == 0) {
      body = <EmptyResultsPanel pluralNoun={"account groups"} />;
    } else {
      body = (
        <TileSet>
          {filteredGroups.map((g) => {
            return (
              <Tile key={g.id}>
                <h4>{g.name}</h4>
                <ul className={"labels"}>
                  <li>Display order: {g.displayOrder}</li>
                </ul>
                <footer>
                  <ul className={"horizonal mb0"}>
                    <li>
                      <a href={""} className={"secondary"} onClick={() => setAccountGroupEditingId(g.id)}>
                        <IconGroup>
                          <Icon name={"edit"} />
                          <span>Edit</span>
                        </IconGroup>
                      </a>
                    </li>

                    <li>
                      <a href={""} className={"secondary"} onClick={() => copyToClipboard(g.id)}>
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
  } else {
    // we shouldn't actually get here
    body = <ErrorPanel error={"Unknown page"} />;
  }

  return (
    <>
      <div id={"content"} className={"overflow-auto"}>
        <PageHeader
          title={page}
          icon={"account_balance"}
          subPages={["Accounts", "Account Groups"]}
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
                Accounts are a wrapper around a collection of one or more <a href={"/settings/holdings"}>holdings</a>;
                usually 1:1 with an actual account held at a financial institution.
              </span>
            </IconGroup>
          </p>

          <p>
            <IconGroup>
              <Icon name={"info"} className={"muted"} />
              <span>
                Accounts groups are named collections of accounts. They are only used to customise dashboard diplays;
                they have no financial meaning.
              </span>
            </IconGroup>
          </p>
        </section>
      </div>

      {accountEditingId ? (
        <AccountEditModal
          accountId={accountEditingId}
          onSaveFinished={() => {
            nudge();
            setAccountEditingId(undefined);
          }}
          onCancel={() => setAccountEditingId(undefined)}
        />
      ) : null}

      {accountGroupEditingId ? (
        <AccountGroupEditModal
          accountGroupId={accountGroupEditingId}
          onSaveFinished={() => {
            nudge();
            setAccountGroupEditingId(undefined);
          }}
          onCancel={() => setAccountGroupEditingId(undefined)}
        />
      ) : null}
    </>
  );
}

export { AccountsPage };
