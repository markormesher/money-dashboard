import React, { ReactElement } from "react";
import { Holding } from "../../../api_gen/moneydashboard/v4/holdings_pb.js";
import { useAsyncEffect, useNudge } from "../../utils/hooks.js";
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
import { holdingServiceClient } from "../../../api/api.js";
import { concatClasses } from "../../utils/style.js";
import { useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { HoldingEditModal } from "./holding-edit-modal.js";

function HoldingsPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Settings"], title: "Holdings" });
  }, []);

  const [nudgeValue, nudge] = useNudge();
  const [error, setError] = React.useState<unknown>();
  const [holdings, setHoldings] = React.useState<Holding[]>();

  const [searchPattern, setSearchPattern] = React.useState<RegExp>();
  const [showInactive, setShowInactive] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string>();
  useKeyShortcut("c", () => setEditingId(NULL_UUID));

  useAsyncEffect(async () => {
    try {
      const res = await holdingServiceClient.getAllHoldings({});
      setHoldings(res.holdings);
    } catch (e) {
      toastBus.error("Failed to load holdings.");
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

  const pageOptions = [
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

  let body: ReactElement;
  if (error) {
    body = <ErrorPanel error={error} />;
  } else if (!holdings) {
    body = <LoadingPanel />;
  } else {
    const filteredHoldings = holdings
      .filter((a) => showInactive || a.active)
      .filter((a) => searchPattern?.test(`${a.account?.name} / ${a.name}`) ?? true)
      .sort((a, b) => `${a.account?.name} / ${a.name}`.localeCompare(`${b.account?.name} / ${b.name}`));

    if (filteredHoldings.length == 0) {
      body = <EmptyResultsPanel pluralNoun={"holdings"} />;
    } else {
      body = (
        <TileSet>
          {filteredHoldings.map((c) => {
            return (
              <Tile key={c.id} className={concatClasses(!c.active && "semi-transparent")}>
                <h4>
                  <span>{c.account?.name}</span>
                  <span className={"separator"}>&#x2022;</span>
                  <span>{c.name}</span>
                </h4>
                <ul className={"labels"}>
                  {!c.active ? <li>Inactive</li> : null}
                  {c.currency ? <li>{c.currency.code}</li> : null}
                  {c.asset ? <li>{c.asset.name}</li> : null}
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
          title={"Holdings"}
          icon={"account_balance_wallet"}
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
                A holding is a balance of cash in a single <a href={"/metadata/currencies"}>currency</a> or an
                investment in a single <a href={"/metadata/assets"}>asset</a> held within an{" "}
                <a href={"/settings/accounts"}>account</a>.
              </span>
            </IconGroup>
          </p>
        </section>
      </div>

      {editingId ? (
        <HoldingEditModal
          holdingId={editingId}
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

export { HoldingsPage };
