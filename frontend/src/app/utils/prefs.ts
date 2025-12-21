import React from "react";

function setPrefValue(key: string, value: string) {
  localStorage.setItem(key, value);
  window.dispatchEvent(new CustomEvent<{ key: string }>("prefChanged", { detail: { key } }));
}

function usePrefValue(key: string): string {
  const [value, setValue] = React.useState("");

  const update = React.useCallback(() => {
    setValue(localStorage.getItem(key) ?? "");
  }, [key, setValue]);

  React.useEffect(() => {
    const listener = (evt: CustomEventInit<{ key: string }>) => {
      if (evt?.detail?.key == key) {
        update();
      }
    };

    window.addEventListener("prefChanged", listener);
    return function cleanup() {
      window.removeEventListener("prefChanged", listener);
    };
  }, [key, update]);

  React.useEffect(() => update(), [update]);

  return value;
}

export { setPrefValue, usePrefValue };
