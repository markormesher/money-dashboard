import React, { ReactElement } from "react";

type RouterContextType = {
  path: string;
  navigate?: (path: string, query?: string) => void;
};

const RouterContext = React.createContext<RouterContextType>({ path: "/" });

const useRouter = () => React.useContext(RouterContext);

function RouterProvider(props: React.PropsWithChildren): ReactElement {
  const [path, setPath] = React.useState(window.location.pathname);

  const navigate = (newPath: string) => {
    if (newPath !== path) {
      window.history.pushState(null, "", newPath);
      setPath(newPath);
    }
  };

  const handleAnchorClick = (evt: MouseEvent) => {
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

    if (targetPath == path) {
      return;
    }

    navigate(targetPath);
  };

  // handle <a> clicks
  React.useEffect(() => {
    document.addEventListener("click", handleAnchorClick);
    return function cleanup() {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [path]);

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

  return <RouterContext.Provider value={{ path, navigate }}>{props.children}</RouterContext.Provider>;
}

export { RouterProvider, useRouter };

