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

function useFresh<T>(v: T): React.RefObject<T> {
  const ref = React.useRef(v);
  React.useEffect(() => {
    ref.current = v;
  }, [v]);
  return ref;
}

export { useAsyncEffect, useAsyncHandler, useWaitGroup, useNudge, useFresh };
export type { WaitGroup };
