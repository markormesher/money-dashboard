import * as fs from "fs";
import { afterEach, describe, it } from "mocha";
import * as sinon from "sinon";
import { isDev, isProd, isTest, runningInDocker } from "./env";

describe(__filename, () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  describe("isProd()", () => {
    it("should return true when running in production", () => {
      sandbox.replace(process.env, "NODE_ENV", "production");
      isProd().should.equal(true);
    });

    it("should return false when not running in production", () => {
      sandbox.replace(process.env, "NODE_ENV", "not-production");
      isProd().should.equal(false);
    });
  });

  describe("isDev()", () => {
    it("should return true when running in development", () => {
      sandbox.replace(process.env, "NODE_ENV", "development");
      isDev().should.equal(true);
    });

    it("should return false when not running in development", () => {
      sandbox.replace(process.env, "NODE_ENV", "not-development");
      isDev().should.equal(false);
    });
  });

  describe("isTest()", () => {
    it("should return true when running in test", () => {
      sandbox.replace(process.env, "NODE_ENV", "test");
      isTest().should.equal(true);
    });

    it("should return false when not running in test", () => {
      sandbox.replace(process.env, "NODE_ENV", "not-test");
      isTest().should.equal(false);
    });
  });

  describe("runningInDocker()", () => {
    it("should return true when the docker flag exists", () => {
      const existsSyncStub = sandbox.stub(fs, "existsSync").callsFake(() => true);
      runningInDocker().should.equal(true);
      existsSyncStub.calledOnceWithExactly("/.dockerenv").should.equal(true);
    });

    it("should return false when the docker flag doesn't exist", () => {
      const existsSyncStub = sandbox.stub(fs, "existsSync").callsFake(() => true);
      runningInDocker().should.equal(true);
      existsSyncStub.calledOnceWithExactly("/.dockerenv").should.equal(true);
    });
  });
});
