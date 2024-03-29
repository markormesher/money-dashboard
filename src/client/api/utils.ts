import { useState } from "react";
import { globalErrorManager } from "../helpers/errors/error-manager";

const cache: Map<string, unknown> = new Map<string, unknown>();

// provides a means to access the cached return value of an expensive function, and update that value if required
// useful on the front-end for API calls to show a value immediately, then update it shortly after
function cacheWrap<T>(key: string, fetchData: () => Promise<T>): () => [T | undefined, () => void] {
  return () => {
    const cachedValue: T | undefined = cache.has(key) ? (cache.get(key) as T) : undefined;

    const [state, setState] = useState<T | undefined>(cachedValue);

    const refresh = () => {
      fetchData()
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
