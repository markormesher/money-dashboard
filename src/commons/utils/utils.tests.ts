import { describe } from "mocha";
import { delayPromise } from "./utils";

describe(__filename, () => {
  describe("delayPromise()", () => {
    it("should resolve", () => {
      // mocha will fail the test if this rejects or doesn't resolve within the timeout
      return delayPromise(1);
    }).timeout(10);

    it("should delay by the correct duration", async () => {
      const start = new Date().getTime();
      const end = await delayPromise(20).then(() => new Date().getTime());
      const duration = end - start;
      duration.should.closeTo(20, 2);
    });
  });
});
