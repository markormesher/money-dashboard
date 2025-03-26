function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) {
    return true;
  }

  const bothAreObjects = a && b && typeof a === "object" && typeof b === "object";

  return (
    bothAreObjects &&
    Object.keys(a).length === Object.keys(b).length &&
    Object.entries(a).every(([k, v]) => deepEqual(v, b[k as keyof T]))
  );
}

export { deepEqual };
