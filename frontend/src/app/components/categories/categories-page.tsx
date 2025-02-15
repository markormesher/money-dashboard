import React, { ReactElement } from "react";
import { Category } from "../../../api_gen/moneydashboard/v4/categories_pb";
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
import { categoryServiceClient } from "../../../api/api";
import { CategoryEditModal } from "./category-edit-modal";

function CategoriesPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Metadata"], title: "Categories" });
  }, []);

  const [nudgeValue, nudge] = useNudge();
  const [error, setError] = React.useState<unknown>();
  const [categories, setCategories] = React.useState<Category[]>();

  const [searchString, setSearchString] = React.useState("");
  const [showInactive, setShowInactive] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string>();

  useAsyncEffect(async () => {
    try {
      const res = await categoryServiceClient.getAllCategories({});
      setCategories(res.categories);
    } catch (e) {
      toastBus.error("Failed to load categories.");
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
  } else if (!categories) {
    body = <LoadingPanel />;
  } else {
    const searchRegex = safeNewRegex(searchString);
    const filteredCategories = categories
      .filter((a) => showInactive || a.active)
      .filter((a) => searchRegex?.test(a.name) ?? true)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (filteredCategories.length == 0) {
      body = <EmptyResultsPanel pluralNoun={"categories"} />;
    } else {
      body = (
        <TileSet>
          {filteredCategories.map((c) => {
            return (
              <Tile key={c.id}>
                <h4>{c.name}</h4>
                <ul className={"labels"}>
                  {!c.active ? <li>Inactive</li> : null}
                  {c.isMemo ? <li>Memo</li> : null}
                  {c.isInterestIncome ? <li>Interest Income</li> : null}
                  {c.isDividendIncome ? <li>Dividend Income</li> : null}
                  {c.isCapitalAcquisition ? <li>Capital Acquisition</li> : null}
                  {c.isCapitalDisposal ? <li>Capital Disposal</li> : null}
                  {c.isCapitalEventFee ? <li>Capital Event Fee</li> : null}
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
          title={"Categories"}
          icon={"label"}
          buttons={pageButtons}
          options={pageOptions}
          optionsStartOpen={true}
        />
        <hr />
        <section>{body}</section>
      </div>

      {editingId ? (
        <CategoryEditModal
          categoryId={editingId}
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

export { CategoriesPage };
