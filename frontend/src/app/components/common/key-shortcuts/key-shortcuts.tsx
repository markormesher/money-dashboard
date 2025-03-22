import React, { ReactElement } from "react";
import { Modal } from "../modal/modal.js";
import { Icon, IconGroup } from "../icon/icon.js";

type KeyShortcutHandler = (evt: KeyboardEvent) => void;

// global set of handlers
const keyShortcutHandlers: Record<string, KeyShortcutHandler> = {};

const CTRLENTER = "CTRLENTER";
const ESCAPE = "ESCAPE";

function useKeyShortcut(targetStr: string, handler: KeyShortcutHandler): void {
  React.useEffect(() => {
    keyShortcutHandlers[targetStr] = handler;
    return function cleanup() {
      delete keyShortcutHandlers[targetStr];
    };
  });
}

function KeyListener(): ReactElement {
  const currentKeyBuffer = React.useRef("");

  const [modalOpen, setModalOpen] = React.useState(false);

  function handleKeyPress(evt: KeyboardEvent): void {
    const isEscape = evt.key == "Escape";
    const isCtrlEnter = evt.key == "Enter" && (evt.ctrlKey || evt.metaKey);

    // if we're inside an input, only handle some keys
    const target = evt.target;
    const inputField = [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement];
    if (inputField.some((t) => target instanceof t)) {
      if (isCtrlEnter) {
        keyShortcutHandlers[CTRLENTER]?.(evt);
        return;
      } else if (isEscape) {
        (target as HTMLElement).blur();
        return;
      } else {
        return;
      }
    }

    if (isEscape) {
      keyShortcutHandlers[ESCAPE]?.(evt);
      return;
    }

    if (isCtrlEnter) {
      keyShortcutHandlers[CTRLENTER]?.(evt);
      return;
    }

    if (evt.ctrlKey) {
      // don't intercept copy, paste, etc.
      return;
    }

    if (evt.key.length == 1) {
      const newKeyBuffer = currentKeyBuffer.current + evt.key;
      const s1 = newKeyBuffer.slice(-2);
      const s2 = newKeyBuffer.slice(-1);

      if (keyShortcutHandlers[s1]) {
        evt.preventDefault();
        keyShortcutHandlers[s1](evt);
      } else if (keyShortcutHandlers[s2]) {
        evt.preventDefault();
        keyShortcutHandlers[s2](evt);
      }

      currentKeyBuffer.current = s2;
    }
  }

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useKeyShortcut("?", () => setModalOpen(true));

  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      header={
        <IconGroup>
          <Icon name={"keyboard"} />
          <span>Keyboard Shortcuts</span>
        </IconGroup>
      }
    >
      <div className={"grid"}>
        <div>
          <ul>
            <li>
              <kbd>gd</kbd> - Go to dashboard
            </li>
            <li>
              <kbd>gt</kbd> - Go to transactions
            </li>
          </ul>
        </div>
        <div>
          <ul>
            <li>
              <kbd>/</kbd> - Search
            </li>
            <li>
              <kbd>c</kbd> - Create entry
            </li>
            <li>
              <kbd>Esc</kbd> - Close pop-up
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

export { KeyListener, useKeyShortcut, CTRLENTER, ESCAPE };
