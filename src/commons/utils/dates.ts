const GLOBAL_MIN_DATE = Date.UTC(2015, 0, 1, 0, 0, 0);

// shifts a local timestamp to UTC without changing the actual time
function convertLocalDateToUtc(input: number): number {
  const localDate = new Date(input);
  return Date.UTC(
    localDate.getFullYear(),
    localDate.getMonth(),
    localDate.getDate(),
    localDate.getHours(),
    localDate.getMinutes(),
    localDate.getSeconds(),
    localDate.getMilliseconds(),
  );
}

// shifts a UTC timestamp to the local time without change the actual clock time
function convertUtcDateToLocal(input: number): number {
  const inputDate = new Date(input);
  return new Date(
    inputDate.getUTCFullYear(),
    inputDate.getUTCMonth(),
    inputDate.getUTCDate(),
    inputDate.getUTCHours(),
    inputDate.getUTCMinutes(),
    inputDate.getUTCSeconds(),
    inputDate.getUTCMilliseconds(),
  ).getTime();
}

export { GLOBAL_MIN_DATE, convertLocalDateToUtc, convertUtcDateToLocal };
