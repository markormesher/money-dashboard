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
