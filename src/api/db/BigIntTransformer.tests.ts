import { expect } from "chai";
import { afterEach, describe, it } from "mocha";
import * as sinon from "sinon";
import { Not } from "typeorm";
import { BigIntTransformer } from "./BigIntTransformer";

describe(__filename, () => {
  const sandbox = sinon.createSandbox();
  const transformer = new BigIntTransformer();

  afterEach(() => {
    sandbox.restore();
  });

  describe("toDbFormat()", () => {
    it("should convert numbers to strings", () => {
      BigIntTransformer.toDbFormat(0).should.equal("0");
      BigIntTransformer.toDbFormat(42).should.equal("42");
    });

    it("should pass on falsy values", () => {
      expect(BigIntTransformer.toDbFormat(null)).to.equal(null);
      expect(BigIntTransformer.toDbFormat(undefined)).to.equal(undefined);
    });
  });

  describe("fromDbFormat()", () => {
    it("should convert strings to numbers", () => {
      BigIntTransformer.fromDbFormat("0").should.equal(0);
      BigIntTransformer.fromDbFormat("42").should.equal(42);
    });

    it("should pass on falsy, non-zero values", () => {
      expect(BigIntTransformer.fromDbFormat(null)).to.equal(null);
      expect(BigIntTransformer.fromDbFormat(undefined)).to.equal(undefined);
    });
  });

  describe("to()", () => {
    it("should not change FindOperator inputs", () => {
      const findOperator = Not("a");
      transformer.to(findOperator).should.equal(findOperator);
    });

    it("should pass all other calls to the static method (normal value)", () => {
      const stub = sandbox.stub(BigIntTransformer, "toDbFormat");
      transformer.to(0);
      stub.calledOnce.should.equal(true);
    });

    it("should pass all other calls to the static method (falsy values)", () => {
      const stub = sandbox.stub(BigIntTransformer, "toDbFormat");
      transformer.to(null);
      transformer.to(undefined);
      stub.calledTwice.should.equal(true);
    });
  });

  describe("from()", () => {
    it("should pass all calls to the static method (normal value)", () => {
      const stub = sandbox.stub(BigIntTransformer, "fromDbFormat");
      transformer.from("0");
      stub.calledOnce.should.equal(true);
    });

    it("should pass all calls to the static method (zero)", () => {
      const stub = sandbox.stub(BigIntTransformer, "fromDbFormat");
      transformer.from("0");
      stub.calledOnce.should.equal(true);
    });

    it("should pass all calls to the static method (falsy values)", () => {
      const stub = sandbox.stub(BigIntTransformer, "fromDbFormat");
      transformer.from(null);
      transformer.from(undefined);
      stub.calledTwice.should.equal(true);
    });
  });
});
