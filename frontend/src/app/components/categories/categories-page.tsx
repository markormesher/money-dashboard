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
import { useCategoryList } from "../../schema/hooks.js";
import { CategoryEditModal } from "./category-edit-modal.js";

function CategoriesPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Settings"], title: "Categories" });
  }, []);

  const [nudgeValue, nudge] = useNudge();
  const [error, setError] = React.useState<unknown>();

  const [searchPattern, setSearchPattern] = React.useState<RegExp>();
  const [showInactive, setShowInactive] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string>();
  useKeyShortcut("c", () => setEditingId(NULL_UUID));

  const categories = useCategoryList({
    dependencies: [nudgeValue],
    onError: (e) => {
      toastBus.error("Failed to load categories.");
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
  } else if (!categories) {
    body = <LoadingPanel />;
  } else {
    const filteredCategories = categories
      .filter((a) => showInactive || a.active)
      .filter((a) => searchPattern?.test(a.name) ?? true)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (filteredCategories.length == 0) {
      body = <EmptyResultsPanel pluralNoun={"categories"} />;
    } else {
      body = (
        <TileSet>
          {filteredCategories.map((c) => {
            return (
              <Tile key={c.id} className={concatClasses(!c.active && "semi-transparent")}>
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
          onSearchTextChange={(p) => setSearchPattern(p)}
        />
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
