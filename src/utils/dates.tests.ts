import { describe } from "mocha";
import { convertLocalDateToUtc, convertUtcDateToLocal } from "./dates";

// TODO: figure out how to fully mock the local timezone
// (just overriding getTimezoneOffset isn't enough)

describe(__filename, () => {
  describe("convertLocalDateToUtc()", () => {
    it("should shift the time by the amount of the local timezone offset", () => {
      const date = new Date();
      const tzOffsetMillis = date.getTimezoneOffset() * 60 * 1000;

      convertLocalDateToUtc(date.getTime()).should.equal(date.getTime() - tzOffsetMillis);
    });
  });

  describe("convertUtcDateToLocal()", () => {
    it("should shift the time by the amount of the local timezone offset", () => {
      const date = new Date();
      const tzOffsetMillis = date.getTimezoneOffset() * 60 * 1000;

      convertUtcDateToLocal(date.getTime()).should.equal(date.getTime() + tzOffsetMillis);
    });
  });
});
