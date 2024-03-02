import * as React from "react";

type KeyShortcutProps = {
  readonly targetStr?: string;
  readonly ctrlEnter?: boolean;
  readonly onTrigger?: () => void;
};

function KeyShortcut(props: React.PropsWithChildren<KeyShortcutProps>): React.ReactElement {
  const { targetStr, ctrlEnter, onTrigger } = props;

  const latestStr = React.useRef("");

  // important: we need to assign a new handler every time the onTrigger function changes, otherwise we end up calling a stale version of it
  React.useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return function cleanup() {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [onTrigger]);

  function handleKeyPress(evt: KeyboardEvent): void {
    // ignore keypresses in inputs (apart from ctrl+enter - respond to that from anywhere)
    const target = evt.target;
    const disallowed = [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement];
    if (!ctrlEnter && disallowed.some((t) => target instanceof t)) {
      return;
    }

    // detect ctrl+enter
    if (ctrlEnter && (evt.ctrlKey || evt.metaKey) && evt.key === "Enter") {
      evt.preventDefault();
      onTrigger?.();
      return;
    }

    // track the latest typed sequence
    if (targetStr) {
      latestStr.current = (latestStr.current + evt.key).slice(-1 * targetStr.length);
      if (latestStr.current === targetStr) {
        evt.preventDefault();
        onTrigger?.();
      }
    }
  }

  return <>{props.children}</>;
}

export { KeyShortcut };
