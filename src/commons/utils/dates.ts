// TODO: move to client utils to avoid ever calling from server code

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

export { convertLocalDateToUtc, convertUtcDateToLocal };
