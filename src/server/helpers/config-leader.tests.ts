import * as fs from "fs";
import { after, afterEach, before, describe, it } from "mocha";
import * as sinon from "sinon";
import {
	clearConstantsCache,
	clearSecretsCache,
	getConstants,
	getDevWebpackConfig,
	getSecret,
	isDev,
	isProd,
	isTest,
	runningInDocker,
} from "./config-loader";

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

	describe("getConstants() and clearConstantsCache()", () => {

		afterEach(() => {
			clearConstantsCache();
		});

		it("should read the file without error when running in production", () => {
			sandbox.replace(process.env, "NODE_ENV", "production");
			getConstants();
		});

		it("should read the file without error when running in development", () => {
			sandbox.replace(process.env, "NODE_ENV", "development");
			getConstants();
		});

		it("should get production constants when running in production", () => {
			sandbox.replace(process.env, "NODE_ENV", "production");
			getConstants().env.should.equal("production");
		});

		it("should get development constants when running in development", () => {
			sandbox.replace(process.env, "NODE_ENV", "development");
			getConstants().env.should.equal("development");
		});

		it("should use cached constants when running more than once", () => {
			const stub = sandbox.stub(fs, "readFileSync").callThrough();
			getConstants();
			stub.callCount.should.equal(1);
			getConstants();
			stub.callCount.should.equal(1);
		});

		it("should re-read the file when the constants cache is cleared", () => {
			const stub = sandbox.stub(fs, "readFileSync").callThrough();
			getConstants();
			stub.callCount.should.equal(1);
			clearConstantsCache();
			getConstants();
			stub.callCount.should.equal(2);
		});
	});

	describe("getSecret() and clearSecretsCache()", () => {

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

		afterEach(() => {
			clearSecretsCache();
		});

		it("should read a secret file without error when not running in docker", () => {
			sandbox.replace(process.env, "RUNNING_IN", "not-docker");
			getSecret("test.secret").should.equal("test-secret");
		});

		it("should read a secret file from the correct path when running in docker", () => {
			sandbox.replace(process.env, "RUNNING_IN", "docker");
			sandbox.stub(fs, "readFileSync").callsFake((...args) => {
				args[0].should.equal("/run/secrets/test.secret");
				return "test-secret";
			});
			getSecret("test.secret").should.equal("test-secret");
		});

		it("should use cached secrets when running more than once", () => {
			const stub = sandbox.stub(fs, "readFileSync").callThrough();
			getSecret("test.secret");
			stub.callCount.should.equal(1);
			getSecret("test.secret");
			stub.callCount.should.equal(1);
		});

		it("should re-read the file when the secrets cache is cleared", () => {
			const stub = sandbox.stub(fs, "readFileSync").callThrough();
			getSecret("test.secret");
			stub.callCount.should.equal(1);
			clearSecretsCache();
			getSecret("test.secret");
			stub.callCount.should.equal(2);
		});
	});

	describe("getDevWebpackConfig()", () => {

		it("should load the config without error", () => {
			const config = getDevWebpackConfig();
			config.should.not.equal(null);
			config.should.not.equal(undefined);
		}).timeout(2000);
	});
});
