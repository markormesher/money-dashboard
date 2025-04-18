function safeNumberValue(v: number | undefined): number | string {
  if (v !== undefined && !isNaN(v)) {
    return v;
  } else {
    return "";
  }
}

function focusFieldByName(name: string): void {
  setTimeout(() => {
    const el = document.querySelector(`input[name='${name}'], select[name='${name}'], textarea[name='${name}']`);
    (el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null)?.focus();
  }, 50);
}

export { safeNumberValue, focusFieldByName };
