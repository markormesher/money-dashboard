import React from "react";
import { deepEqual } from "./utils";

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

type FormState<T> = {
  model: Partial<T> | undefined;
  setModel: (model: T | undefined) => void;
  patchModel: (patch: Partial<T>) => void;

  busy: boolean;
  setBusy: (busy: boolean) => void;

  hasChanges: boolean;

  fatalError: unknown;
  setFatalError: (busy: unknown) => void;
};

function useForm<T>(): FormState<T> {
  // TODO: validation

  const [originalModel, setOriginalModel] = React.useState<Partial<T>>();
  const [model, setModelInner] = React.useState<Partial<T>>();
  const [busy, setBusy] = React.useState(false);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [fatalError, setFatalError] = React.useState<unknown>();

  const setModel = (m: T | undefined) => {
    setOriginalModel(m);
    setModelInner(m);
  };

  const patchModel = (m: Partial<T>) => {
    setModelInner((curr) => {
      return { ...curr, ...m };
    });
  };

  React.useEffect(() => {
    setHasChanges(!deepEqual(model, originalModel));
  }, [model, originalModel]);

  return {
    model,
    setModel,
    patchModel,
    busy,
    setBusy,
    hasChanges,
    fatalError,
    setFatalError,
  };
}

export { useAsyncEffect, useAsyncHandler, useWaitGroup, useForm };
