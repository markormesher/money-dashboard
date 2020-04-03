import { describe } from "mocha";
import { convertLocalDateToServerDate, convertServerDateToLocalDate } from "./dates";

describe(__filename, () => {
  describe("convertLocalDateToServerDate()", () => {
    it("TODO", () => {
      convertLocalDateToServerDate(0);
    });
  });

  describe("convertServerDateToLocalDate()", () => {
    it("TODO", () => {
      convertServerDateToLocalDate(0);
    });
  });
});

// describe(__filename, () => {
//   describe("utcDate()", () => {
//     it("should return the current date, forced to UTC", () => {
//       const nowAsUtc = new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000;
//       const result = utcDate();
//       Math.abs(differenceInSeconds(nowAsUtc, result)).should.be.within(0, 2);
//     });

//     it("should not transform timestamp inputs", () => {
//       utcDate(1234).should.equal(1234);
//     });

//     it("should parse string dates", () => {
//       utcDate("2015-04-01").should.equal(Date.UTC(2015, 3, 1));
//     });

//     it("should reject badly formatted string dates", () => {
//       expect(() => {
//         utcDate("blah");
//       }).to.throw(Error, "Date string did not match yyyy-mm-dd");
//       expect(() => {
//         utcDate("9999-99-99");
//       }).to.throw(Error, "Date string did not match yyyy-mm-dd");
//     });

//     it("should reject invalid string dates", () => {
//       expect(() => {
//         utcDate("2020-02-31");
//       }).to.throw(Error, "Date string was not a valid date");
//     });

//     it("should force date inputs to UTC", () => {
//       const input = new Date("2015-04-01T12:00:00+0500");
//       console.log(input.getHours() + " @ " + input.getTimezoneOffset());
//       utcDate(input).should.equal(Date.UTC(2015, 3, 1, 12, 0, 0));
//     });
//   });

//   describe("fixedDate()", () => {
//     it("should return the current date when called with no argument", () => {
//       const now = new Date();
//       const result = fixedDate();
//       Math.abs(differenceInSeconds(now, result)).should.be.within(0, 2);
//     });

//     it("should return the date version of a timestamp given", () => {
//       isEqual(fixedDate(0), new Date(0)).should.equal(true);
//       isEqual(fixedDate(123456), new Date(123456)).should.equal(true);
//     });

//     it("should return the date version of a string given", () => {
//       console.log(fixedDate("2015-04-01"));
//       console.log(Date.UTC(2015, 3, 1));
//       isEqual(fixedDate("2015-04-01"), new Date(2015, 3, 1)).should.equal(true);
//     });
//   });
// });
