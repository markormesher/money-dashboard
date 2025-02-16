import React, { ReactElement } from "react";
import { Holding } from "../../../api_gen/moneydashboard/v4/holdings_pb";
import { useAsyncEffect, useNudge } from "../../utils/hooks";
import { toastBus } from "../toaster/toaster";
import { Icon, IconGroup } from "../common/icon/icon";
import { useRouter } from "../app/router";
import { PageHeader } from "../page-header/page-header";
import { LoadingPanel } from "../common/loading/loading";
import { ErrorPanel } from "../common/error/error";
import { Tile, TileSet } from "../common/tile-set/tile-set";
import { copyToClipboard, safeNewRegex } from "../../utils/text";
import { NULL_UUID } from "../../../config/consts";
import { EmptyResultsPanel } from "../common/empty/empty-results";
import { holdingServiceClient } from "../../../api/api";
import { concatClasses } from "../../utils/style";
// import { HoldingEditModal } from "./holding-edit-modal";

function HoldingsPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Metadata"], title: "Holdings" });
  }, []);

  const [nudgeValue, nudge] = useNudge();
  const [error, setError] = React.useState<unknown>();
  const [holdings, setHoldings] = React.useState<Holding[]>();

  const [searchString, setSearchString] = React.useState("");
  const [showInactive, setShowInactive] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string>();

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
  } else if (!holdings) {
    body = <LoadingPanel />;
  } else {
    const searchRegex = safeNewRegex(searchString);
    const filteredHoldings = holdings
      .filter((a) => showInactive || a.active)
      .filter((a) => searchRegex?.test(`${a.account?.name} / ${a.name}`) ?? true)
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
                  <span className={"muted"}>{c.account?.name}</span> / {c.name}
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
                A holding is a balance of cash in a single <a href={"/metadata/currencies"}>currency</a> or an
                investment in a single <a href={"/metadata/assets"}>asset</a> held within an{" "}
                <a href={"/records/accounts"}>account</a>.
              </span>
            </IconGroup>
          </p>
        </section>
      </div>

      {/*
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
      */}
    </>
  );
}

export { HoldingsPage };
