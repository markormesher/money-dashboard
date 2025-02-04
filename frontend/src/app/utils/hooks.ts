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

export { useAsyncEffect, useAsyncHandler };
