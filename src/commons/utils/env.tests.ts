import { after, afterEach, before, describe, it } from "mocha";
import * as sinon from "sinon";
import { isDev, isProd, isTest, runningInDocker, isPrimaryServer } from "./env";

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

  describe("isPrimaryServer()", () => {
    after(() => {
      delete process.env.RUNNING_IN;
    });

    it("should return true when running on primary server", () => {
      process.env.IS_PRIMARY_SERVER = "yes";
      isPrimaryServer().should.equal(true);
    });

    it("should return false when running on non-primary server", () => {
      process.env.IS_PRIMARY_SERVER = "no";
      isPrimaryServer().should.equal(false);
    });

    it("should return false when running on unknown server", () => {
      process.env.IS_PRIMARY_SERVER = null;
      isPrimaryServer().should.equal(false);
    });
  });

  describe("runningInDocker()", () => {
    let didAddRunningInEnvVar = false;

    before(() => {
      if (!process.env.RUNNING_IN) {
        didAddRunningInEnvVar = true;
        process.env.RUNNING_IN = "";
      }
    });

    after(() => {
      if (didAddRunningInEnvVar) {
        delete process.env.RUNNING_IN;
      }
    });

    it("should return true when running in docker", () => {
      sandbox.replace(process.env, "RUNNING_IN", "docker");
      runningInDocker().should.equal(true);
    });

    it("should return false when not running in docker", () => {
      sandbox.replace(process.env, "RUNNING_IN", "not-docker");
      runningInDocker().should.equal(false);
    });

    it("should return false 'running in' variable is not defined", () => {
      // manual stubbing b/c sinon sandbox can't stub a variable to "undefined"
      const originalVal = process.env.RUNNING_IN;
      process.env.RUNNING_IN = undefined;
      runningInDocker().should.equal(false);
      process.env.RUNNING_IN = originalVal;
    });
  });
});
