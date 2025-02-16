import React, { ReactElement } from "react";
import { v4 } from "uuid";
import "./toaster.css";
import { Icon, IconGroup } from "../common/icon/icon.js";

const toastDurationMs = 4000;
const animationGraceMs = 1000;

type ToastSentiment = "info" | "success" | "error";

type Toast = {
  id: string;
  sentiment: ToastSentiment;
  text: string;
  expiryTs: number;
};

const toastBus = (function () {
  type ToastListener = (t: Toast) => void;
  let listener: ToastListener | undefined = undefined;

  function setListener(l: ToastListener) {
    listener = l;
  }

  function emit(t: Omit<Toast, "id" | "expiryTs">) {
    listener?.call(null, {
      id: v4(),
      expiryTs: new Date().getTime() + toastDurationMs,
      ...t,
    });
  }

  function info(text: string): void {
    emit({ sentiment: "info", text });
  }

  function success(text: string): void {
    emit({ sentiment: "success", text });
  }

  function error(text: string): void {
    emit({ sentiment: "error", text });
  }

  return {
    setListener,
    emit,
    info,
    success,
    error,
  };
})();

function Toaster(): ReactElement {
  const [renderToken, setRenderToken] = React.useState(0);
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const triggerRender = () => setRenderToken(new Date().getTime());

  // toast listener
  React.useEffect(() => {
    const listener = (t: Toast) => {
      setToasts((curr) => [t, ...curr]);
      triggerRender();
    };
    toastBus.setListener(listener);
  }, []);

  // toast reaper + re-render
  // this is used to avoid any effects running when there are no toasts to care about
  React.useEffect(() => {
    // remove toasts that are past expiry + animation grace
    const nowTs = new Date().getTime();
    setToasts((curr) => curr.filter((t) => t.expiryTs + animationGraceMs >= nowTs));

    // trigger another loop if there are still toasts to display
    let t: NodeJS.Timeout;
    if (toasts.length > 0) {
      t = setTimeout(() => triggerRender(), 100);
    }

    return function cleanup() {
      if (t) {
        clearTimeout(t);
      }
    };
  }, [renderToken]);

  const toastOutput: ReactElement[] = [];
  let toastsVisible = 0;
  const nowTs = new Date().getTime();
  for (const t of toasts) {
    const remainingLifeMs = t.expiryTs - nowTs;
    const visible = remainingLifeMs > 0;
    const pos = 15 + toastsVisible * 55;

    let icon = "";
    switch (t.sentiment) {
      case "info":
        icon = "info";
        break;
      case "success":
        icon = "check_circle";
        break;
      case "error":
        icon = "warning";
        break;
    }

    toastOutput.push(
      <div
        key={t.id}
        className={`toast ${visible ? "toast-show" : ""} toast-${t.sentiment}`}
        style={{ top: `${pos}px` }}
      >
        <div className={`toast-text`}>
          <IconGroup>
            <Icon name={icon} />
            <span>{t.text}</span>
          </IconGroup>
        </div>
        <div className={`toast-progress`} style={{ width: `${(remainingLifeMs / toastDurationMs) * 100}%` }}></div>
      </div>,
    );

    if (visible) {
      toastsVisible++;
    }
  }

  return <>{toastOutput}</>;
}

export { Toaster, toastBus };
