import { getMonth, getDate, getYear, endOfDay } from "date-fns";

const APRIL_MONTH = 3; // months are zero-indexed; 3 = April

function getTaxYear(date: number): number {
  if (getMonth(date) === APRIL_MONTH) {
    if (getDate(date) >= 6) {
      return getYear(date);
    } else {
      return getYear(date) - 1;
    }
  } else if (getMonth(date) > APRIL_MONTH) {
    return getYear(date);
  } else {
    return getYear(date) - 1;
  }
}

function getTaxYearStart(startYear: number): number {
  return new Date(startYear, APRIL_MONTH, 6).getTime();
}

function getTaxYearEnd(startYear: number): number {
  return endOfDay(new Date(startYear + 1, APRIL_MONTH, 5)).getTime();
}

function groupBy<T>(
  data: T[],
  identifier: (entity: T) => string | number,
): { readonly [key: string]: T[] } | { readonly [key: number]: T[] } {
  const empty: { [key: string]: T[] } = {};
  return data.reduce((returnVal, entity) => {
    const key = identifier(entity);
    (returnVal[identifier(entity)] = returnVal[key] || []).push(entity);
    return returnVal;
  }, empty);
}

function isObject(item: unknown): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep<T>(target: T, ...sources: (Partial<T> | undefined)[]): T {
  if (!sources.length) {
    return target;
  }

  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}


export { getTaxYear, getTaxYearStart, getTaxYearEnd, groupBy, mergeDeep };
