import * as React from "react";

type KeyShortcutProps = {
  readonly targetStr: string;
  readonly onTrigger: () => void;
};

function KeyShortcut(props: React.PropsWithChildren<KeyShortcutProps>): React.ReactElement {
  const { targetStr, onTrigger } = props;

  const latestStr = React.useRef("");

  React.useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return function cleanup() {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  function handleKeyPress(evt: KeyboardEvent): void {
    const target = evt.target;
    const disallowed = [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement];
    if (disallowed.some((t) => target instanceof t)) {
      return;
    }

    const key = evt.key;
    latestStr.current = (latestStr.current + key).slice(-1 * targetStr.length);

    if (latestStr.current === targetStr) {
      evt.preventDefault();
      onTrigger();
    }
  }

  return <>{props.children}</>;
}

export { KeyShortcut };
