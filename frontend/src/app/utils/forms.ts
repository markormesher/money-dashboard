function safeNumberValue(v: number | undefined): number | string {
  if (v !== undefined && !isNaN(v)) {
    return v;
  } else {
    return "";
  }
}

export { safeNumberValue };
