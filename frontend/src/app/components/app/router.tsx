import React, { type ReactElement } from "react";

type PageMeta = {
  title: string;
  parents?: string[];
};

const defaultMeta: Partial<PageMeta> = {
  parents: [],
};

type RouterContextType = {
  path: string;
  navigate: (path: string, query?: string) => void;

  meta: PageMeta;
  setMeta: (meta: PageMeta) => void;
};

const RouterContext = React.createContext<RouterContextType | null>(null);

const useRouter = (): RouterContextType => {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a <RouterProvider>");
  }

  return context;
};

function RouterProvider(props: React.PropsWithChildren): ReactElement {
  const [path, setPath] = React.useState(window.location.pathname);
  const [meta, setMetaInner] = React.useState({ title: "" });

  const navigate = React.useCallback(
    (newPath: string) => {
      if (newPath !== path) {
        window.history.pushState(null, "", newPath);
        setPath(newPath);
      }
    },
    [path],
  );

  const setMeta = React.useCallback((newMeta: PageMeta) => {
    setMetaInner({ ...defaultMeta, ...newMeta });
  }, []);

  const handleAnchorClick = React.useCallback(
    (evt: MouseEvent) => {
      const anchor = (evt.target as Element)?.closest("a");
      if (!anchor) {
        return;
      }

      // links leading out of this domain are handled as normal
      if (anchor.origin !== window.location.origin) {
        return;
      }

      evt.preventDefault();

      const url = new URL(anchor.href ?? window.location);
      const targetPath = url.pathname;

      if (targetPath === path) {
        return;
      }

      navigate(targetPath);
    },
    [path, navigate],
  );

  // handle <a> clicks
  React.useEffect(() => {
    document.addEventListener("click", handleAnchorClick);
    return function cleanup() {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [handleAnchorClick]);

  // handle forward/backward navigation
  React.useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopState);
    return function cleanup() {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return <RouterContext.Provider value={{ path, navigate, meta, setMeta }}>{props.children}</RouterContext.Provider>;
}

export { RouterProvider, useRouter };
