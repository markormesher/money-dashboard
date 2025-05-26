import { toastBus } from "../components/toaster/toaster.js";

function copyToClipboard(str: string): void {
  const elem = document.createElement("input");
  elem.style.display = "none";
  elem.value = str;
  document.body.appendChild(elem);

  elem.select();
  elem.setSelectionRange(0, 999999);

  navigator.clipboard
    .writeText(elem.value)
    .then(() => {
      toastBus.success("Copied to clipboard.");
      document.body.removeChild(elem);
    })
    .catch((e) => {
      toastBus.error("Failed to copy to clipboard.");
      console.log(e);
      document.body.removeChild(elem);
    });
}

function safeJsonStringify(v: unknown): string {
  return JSON.stringify(v, (_, value: unknown) => (typeof value === "bigint" ? value.toString() : value), 2);
}

export { copyToClipboard, safeJsonStringify };
