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
import { GBP_CURRENCY_ID, NULL_UUID } from "../../../config/consts.js";
import { EmptyResultsPanel } from "../common/empty/empty-results.js";
import { concatClasses } from "../../utils/style.js";
import { useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { useCurrencyList, useLatestRates } from "../../schema/hooks.js";
import { CurrencyEditModal } from "./currency-edit-modal.js";

function CurrenciesPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Metadata"], title: "Currencies" });
  }, []);

  const [nudgeValue, nudge] = useNudge();
  const [error, setError] = React.useState<unknown>();

  const [showInactive, setShowInactive] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string>();
  useKeyShortcut("c", () => setEditingId(NULL_UUID));

  const currencies = useCurrencyList({
    dependencies: [nudgeValue],
    onError: (e) => {
      toastBus.error("Failed to load currencies.");
      setError(e);
    },
  });

  const rates = useLatestRates({
    dependencies: [nudgeValue],
    onError: (e) => {
      toastBus.error("Failed to load currency rates.");
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
  } else if (!currencies || !rates) {
    body = <LoadingPanel />;
  } else {
    const filteredCurrencies = currencies
      .filter((c) => showInactive || c.active)
      .sort((a, b) => a.code.localeCompare(b.code));

    if (filteredCurrencies.length == 0) {
      body = <EmptyResultsPanel pluralNoun={"currencies"} />;
    } else {
      body = (
        <TileSet>
          {filteredCurrencies.map((c) => {
            const isGbp = c.id == GBP_CURRENCY_ID;
            const rate = rates[c.id];

            return (
              <Tile key={c.id} className={concatClasses(!c.active && "semi-transparent")}>
                <h4>
                  {c.symbol} {c.code}
                </h4>
                <ul className={"labels"}>
                  {!c.active ? <li>Inactive</li> : null}
                  {rate ? (
                    <>
                      <li>
                        &pound; = {c.symbol}
                        {rate.rate.toFixed(c.displayPrecision)}
                      </li>
                      {!isGbp ? <li>Updated {formatDateFromProto(rate.date)}</li> : null}
                    </>
                  ) : (
                    <li>No rate data</li>
                  )}
                </ul>
                <footer>
                  {isGbp ? (
                    <small className={"muted"}>The base currency cannot be edited.</small>
                  ) : (
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
                  )}
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
        <PageHeader title={"Currencies"} icon={"payments"} buttons={pageButtons} options={pageOptions} />
        <section>{body}</section>
      </div>

      {editingId ? (
        <CurrencyEditModal
          currencyId={editingId}
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

export { CurrenciesPage };
