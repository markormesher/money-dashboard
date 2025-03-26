import React, { ReactElement } from "react";
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
import { useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { useProfileList } from "../../schema/hooks.js";
import { ProfileEditModal } from "./profile-edit-modal.js";

function ProfilesPage(): ReactElement {
  const { setMeta } = useRouter();
  React.useEffect(() => {
    setMeta({ parents: ["Settings"], title: "Profiles" });
  }, []);

  const [error, setError] = React.useState<unknown>();

  const [editingId, setEditingId] = React.useState<string>();
  useKeyShortcut("c", () => setEditingId(NULL_UUID));

  const profiles = useProfileList({
    dependencies: [],
    onError: (e) => {
      toastBus.error("Failed to load profiles.");
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

  let body: ReactElement;
  if (error) {
    body = <ErrorPanel error={error} />;
  } else if (!profiles) {
    body = <LoadingPanel />;
  } else {
    const filteredProfiles = profiles.sort((a, b) => a.name.localeCompare(b.name));

    if (filteredProfiles.length == 0) {
      body = <EmptyResultsPanel pluralNoun={"profiles"} />;
    } else {
      body = (
        <TileSet>
          {filteredProfiles.map((p) => {
            return (
              <Tile key={p.id}>
                <h4>{p.name}</h4>
                <footer>
                  <ul className={"horizonal mb0"}>
                    <li>
                      <a href={""} className={"secondary"} onClick={() => setEditingId(p.id)}>
                        <IconGroup>
                          <Icon name={"edit"} />
                          <span>Edit</span>
                        </IconGroup>
                      </a>
                    </li>

                    <li>
                      <a href={""} className={"secondary"} onClick={() => copyToClipboard(p.id)}>
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
        <PageHeader title={"Profiles"} icon={"group"} buttons={pageButtons} />
        <section>{body}</section>
        <hr />
        <section>
          <p>
            <IconGroup>
              <Icon name={"info"} className={"muted"} />
              <span>
                Profiles are collection of accounts, holdings, transactions, budgets, etc. that can be shared between
                multiple users.
              </span>
            </IconGroup>
          </p>
        </section>
      </div>

      {editingId ? (
        <ProfileEditModal
          profileId={editingId}
          onSaveFinished={() => {
            setEditingId(undefined);
            window.location.reload();
          }}
          onCancel={() => setEditingId(undefined)}
        />
      ) : null}
    </>
  );
}

export { ProfilesPage };
