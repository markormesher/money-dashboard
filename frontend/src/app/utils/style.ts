function concatClasses(...classes: (string | boolean | null | undefined)[]): string {
  return classes.filter((c) => !!c).join(" ");
}

export { concatClasses };
