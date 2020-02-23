import { expect } from "chai";
import { afterEach, describe } from "mocha";
import * as sinon from "sinon";
import { v4 } from "uuid";
import { cleanUuid, mapEntitiesFromApi, NULL_UUID } from "./entities";

describe(__filename, () => {
  describe("mapEntitiesFrom()", () => {
    const spy = sinon.spy();

    afterEach(() => {
      spy.resetHistory();
    });

    it("return undefined for null/undefined inputs", () => {
      expect(mapEntitiesFromApi(spy, null)).to.equal(undefined);
      expect(mapEntitiesFromApi(spy, undefined)).to.equal(undefined);
      spy.notCalled.should.equal(true);
    });

    it("return an empty array for empty array inputs", () => {
      mapEntitiesFromApi(spy, []).should.deep.equal([]);
      spy.notCalled.should.equal(true);
    });

    it("should call the mapper for each value in the input array", () => {
      mapEntitiesFromApi(spy, ["val1", "val2"]);
      spy.callCount.should.equal(2);
      spy.firstCall.args[0].should.equal("val1");
      spy.secondCall.args[0].should.equal("val2");
    });
  });

  describe("cleanUuid()", () => {
    it("should return the null UUID for falsy inputs", () => {
      cleanUuid(null).should.equal(NULL_UUID);
      cleanUuid(undefined).should.equal(NULL_UUID);
    });

    it("should return the UUID for valid inputs (generic UUID - lower case)", () => {
      const uuid = v4().toLowerCase();
      cleanUuid(uuid).should.equal(uuid);
    });

    it("should return the UUID for valid inputs (generic UUID - upper case)", () => {
      const uuid = v4().toUpperCase();
      cleanUuid(uuid).should.equal(uuid);
    });

    it("should return the UUID for valid inputs (generic UUID - mixed case)", () => {
      let uuid = v4();
      uuid = uuid.toLowerCase().substr(0, 12) + uuid.toUpperCase().substring(12);
      cleanUuid(uuid).should.equal(uuid);
    });

    it("should return the UUID for valid inputs (null UUID)", () => {
      cleanUuid(NULL_UUID).should.equal(NULL_UUID);
    });

    it("should throw an error for invalid inputs (wrong format)", () => {
      expect(() => cleanUuid("not a uuid")).to.throw();
    });

    it("should throw an error for invalid inputs (wrong version)", () => {
      // note "0" in first position of third block; valid versions are 1-5
      expect(() => cleanUuid("73ea6d9e-bad0-0ddc-8eff-369b369ac3a9")).to.throw();
    });

    it("should throw an error for invalid inputs (wrong variant)", () => {
      // note "0" in first position of fourth block; valid variants are 8/9/a/b
      expect(() => cleanUuid("73ea6d9e-bad0-4ddc-0eff-369b369ac3a9")).to.throw();
    });

    it("should include the bad UUID in the error for invalid inputs", () => {
      expect(() => cleanUuid("not a uuid")).to.throw(/not a uuid/);
    });
  });
});
