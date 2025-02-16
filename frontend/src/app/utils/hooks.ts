import React from "react";

function useAsyncEffect(f: () => Promise<void>, dependencies?: React.DependencyList): void {
  React.useEffect(() => {
    f().catch((err) => {
      console.log("Uncaught error in async useEffect function!");
      console.log(err);
    });
  }, dependencies);
}

function useAsyncHandler<T = void>(f: (arg: T) => Promise<void>): (arg: T) => void {
  return (arg: T) => {
    f(arg).catch((err) => {
      console.log("Uncaught error in async useEffect function!");
      console.log(err);
    });
  };
}

type WaitGroup = {
  count: number;
  add: (qty?: number) => void;
  done: (qty?: number) => void;
};

function useWaitGroup(): WaitGroup {
  const [count, setCount] = React.useState(0);

  const add = (qty?: number) => {
    setCount((curr) => curr + (qty ?? 1));
  };

  const done = (qty?: number) => {
    setCount((curr) => curr - (qty ?? 1));
  };

  return { count, add, done };
}

function useNudge(): [number, () => void] {
  const [nudgeValue, setNudge] = React.useState(0);
  const nudge = () => {
    setNudge(new Date().getTime());
  };

  return [nudgeValue, nudge];
}

type KeyShortcutOptions = {
  readonly targetStr?: string;
  readonly ctrlEnter?: boolean;
  readonly onTrigger?: () => void;
};

function useKeyShortcut(opts: KeyShortcutOptions): void {
  const { targetStr, ctrlEnter, onTrigger } = opts;
  const latestStr = React.useRef("");

  function handleKeyPress(evt: KeyboardEvent): void {
    // ignore keypresses in inputs (apart from ctrl+enter - respond to that from anywhere)
    const target = evt.target;
    const disallowed = [HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement];
    if (!ctrlEnter && disallowed.some((t) => target instanceof t)) {
      return;
    }

    if (ctrlEnter && (evt.ctrlKey || evt.metaKey) && evt.key === "Enter") {
      evt.preventDefault();
      onTrigger?.();
      return;
    }

    if (targetStr) {
      latestStr.current = (latestStr.current + evt.key).slice(-1 * targetStr.length);

      if (latestStr.current === targetStr) {
        evt.preventDefault();
        onTrigger?.();
      }
    }
  }

  React.useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    return function cleanup() {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, []);
}

export { useAsyncEffect, useAsyncHandler, useWaitGroup, useNudge, useKeyShortcut };
export type { WaitGroup };
