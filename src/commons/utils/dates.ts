function convertLocalDateToServerDate(input: number): number {
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

function convertServerDateToLocalDate(input: Date): Date {
  return new Date(
    input.getUTCFullYear(),
    input.getUTCMonth(),
    input.getUTCDate(),
    input.getUTCHours(),
    input.getUTCMinutes(),
    input.getUTCSeconds(),
    input.getUTCMilliseconds(),
  );
}

// // returns a timestamp, forced to UTC time (e.g. if the input is 1700h +5, the output will be 1700h +0)
// function utcDate(input?: Date | string | number): number {
//   // return the current date if no input is given
//   if (input === null || input === undefined || input === "") {
//     const now = new Date();
//     return Date.UTC(
//       now.getFullYear(),
//       now.getMonth(),
//       now.getDate(),
//       now.getHours(),
//       now.getMinutes(),
//       now.getSeconds(),
//     );
//   }

//   // return the input as-is if we already get a timestamp
//   if (typeof input === typeof 1) {
//     return input as number;
//   }

//   // parse strings into dates
//   if (typeof input === typeof "") {
//     const inputStr = input as string;
//     if (!inputStr.match(/(19|20)\d{2}-[012]\d-[0123]\d/)) {
//       throw new Error("Date string did not match yyyy-mm-dd");
//     }

//     const inputStrChunks = inputStr.split("-");
//     const inputStrYear = parseInt(inputStrChunks[0]);
//     const inputStrMonth = parseInt(inputStrChunks[1]) - 1; // months are zero-indexed
//     const inputStrDate = parseInt(inputStrChunks[2]);

//     const inputAsDate = new Date(inputStrYear, inputStrMonth, inputStrDate);

//     if (
//       inputAsDate.getFullYear() !== inputStrYear ||
//       inputAsDate.getMonth() !== inputStrMonth ||
//       inputAsDate.getDate() !== inputStrDate
//     ) {
//       throw new Error("Date string was not a valid date");
//     }

//     return Date.UTC(inputStrYear, inputStrMonth, inputStrDate);
//   }

//   // force dates into UTC
//   if (typeof input === typeof new Date()) {
//     return Date.UTC(
//       (input as Date).getFullYear(),
//       (input as Date).getMonth(),
//       (input as Date).getDate(),
//       (input as Date).getHours(),
//       (input as Date).getMinutes(),
//       (input as Date).getSeconds(),
//     );
//   }
// }

// function fixedDate(input?: Date | string | number): Date {
//   // TODO: make sure the date component never changes, even if we're in a different timezone
//   if (input || input === 0) {
//     const inputDate = new Date(input);

//     if (typeof input === typeof "") {
//       const inputStr = input as string;
//       if (!inputStr.match(/(19|20)\d{2}-[012]\d-[0123]\d/)) {
//         throw new Error("Date string did not match yyyy-mm-dd");
//       }

//       const inputStrChunks = inputStr.split("-");
//       const inputStrYear = parseInt(inputStrChunks[0]);
//       const inputStrMonth = parseInt(inputStrChunks[1]) - 1; // months are zero-indexed
//       const inputStrDate = parseInt(inputStrChunks[2]);

//       if (
//         inputDate.getFullYear() !== inputStrYear ||
//         inputDate.getMonth() !== inputStrMonth ||
//         inputDate.getDate() !== inputStrDate
//       ) {
//         throw new Error("Date string was not a valid date");
//       }
//     }

//     return inputDate;
//   } else {
//     return new Date();
//   }
// }

export { convertLocalDateToServerDate, convertServerDateToLocalDate };
