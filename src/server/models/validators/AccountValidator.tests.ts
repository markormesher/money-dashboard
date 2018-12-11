import { afterEach, describe } from "mocha";
import * as sinon from "sinon";
import { DEFAULT_ACCOUNT } from "../IAccount";
import { validateAccount } from "./AccountValidator";

describe(__filename, () => {

	// TODO: tests

	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	describe("method()", () => {

		it("should do something", () => {
			validateAccount(DEFAULT_ACCOUNT);
		});
	});
});
