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
import { formatDateFromProto } from "../../utils/dates.js";
import { NULL_UUID } from "../../../config/consts.js";
import { EmptyResultsPanel } from "../common/empty/empty-results.js";
import { concatClasses } from "../../utils/style.js";
import { useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { useAssetList, useLatestRates } from "../../schema/hooks.js";
import { AssetEditModal } from "./asset-edit-modal.js";

function AssetsPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Metadata"], title: "Assets" });
  }, []);

  const [nudgeValue, nudge] = useNudge();
  const [error, setError] = React.useState<unknown>();

  const [searchPattern, setSearchPattern] = React.useState<RegExp>();
  const [showInactive, setShowInactive] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string>();
  useKeyShortcut("c", () => setEditingId(NULL_UUID));

  const assets = useAssetList({
    dependencies: [nudgeValue],
    onError: (e) => {
      toastBus.error("Failed to load assets.");
      setError(e);
    },
  });

  const rates = useLatestRates({
    dependencies: [nudgeValue],
    onError: (e) => {
      toastBus.error("Failed to load asset rates.");
      setError(e);
    },
  });

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
  } else if (!assets || !rates) {
    body = <LoadingPanel />;
  } else {
    const filteredAssets = assets
      .filter((a) => showInactive || a.active)
      .filter((a) => searchPattern?.test(a.name) ?? true)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (filteredAssets.length == 0) {
      body = <EmptyResultsPanel pluralNoun={"assets"} />;
    } else {
      body = (
        <TileSet>
          {filteredAssets.map((a) => {
            const rate = rates[a.id];
            return (
              <Tile key={a.id} className={concatClasses(!a.active && "semi-transparent")}>
                <h4>{a.name}</h4>
                <ul className={"labels"}>
                  {!a.active ? <li>Inactive</li> : null}
                  <li>{a.currency?.code}</li>
                  {rate !== undefined ? (
                    <>
                      <li>
                        {a.currency?.symbol}
                        {rate.rate.toFixed(a.calculationPrecision)}
                      </li>
                      <li>Updated {formatDateFromProto(rate.date)}</li>
                    </>
                  ) : (
                    <li>No rate data</li>
                  )}
                </ul>
                {!!a.notes ? <small>{a.notes}</small> : null}
                <footer>
                  <ul className={"horizonal mb0"}>
                    <li>
                      <a href={""} className={"secondary"} onClick={() => setEditingId(a.id)}>
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
  }

  return (
    <>
      <div id={"content"} className={"overflow-auto"}>
        <PageHeader
          title={"Assets"}
          icon={"candlestick_chart"}
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
                Assets represent one unit of a non-cash instrument with a value that changes over time, such as a house
                or a share in a company.
              </span>
            </IconGroup>
          </p>
        </section>
      </div>

      {editingId ? (
        <AssetEditModal
          assetId={editingId}
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

export { AssetsPage };
