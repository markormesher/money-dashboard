import { useState } from "react";
import { globalErrorManager } from "../helpers/errors/error-manager";

const cache: Map<string, unknown> = new Map<string, unknown>();

function cacheWrap<T>(key: string, f: () => Promise<T>): () => [T | undefined, () => void] {
  return () => {
    const cachedValue: T | undefined = cache.has(key) ? (cache.get(key) as T) : undefined;

    const [state, setState] = useState<T | undefined>(cachedValue);

    const refresh = () => {
      f()
        .then((v) => {
          cache.set(key, v);
          setState(v);
        })
        .catch((err) => {
          globalErrorManager.emitNonFatalError("Failed to reload cached data", err);
        });
    };

    return [state, refresh];
  };
}

export { cacheWrap };
