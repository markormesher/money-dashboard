import { ReactElement, useEffect, useRef } from "react";

type KeyShortcutProps = {
  readonly targetStr: string;
  readonly onTrigger: () => void;
};

function KeyShortcut(props: KeyShortcutProps): ReactElement | null {
  const latestStringRef = useRef<string>("");

  function handleKeyPress(evt: KeyboardEvent): void {
    const target = evt.target;
    const disallowed = [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement];
    if (disallowed.some((t) => target instanceof t)) {
      return;
    }

    const { targetStr, onTrigger } = props;
    const key = evt.key;
    latestStringRef.current = (latestStringRef.current + key).slice(-1 * targetStr.length);
    if (latestStringRef.current == targetStr) {
      onTrigger();
    }
  }

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return function cleanup() {
      document.removeEventListener("keypress", handleKeyPress);
    };
  });

  return null;
}

export { KeyShortcut };
