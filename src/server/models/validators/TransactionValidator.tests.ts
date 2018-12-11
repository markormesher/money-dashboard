import { afterEach, describe } from "mocha";
import * as sinon from "sinon";
import { DEFAULT_TRANSACTION } from "../ITransaction";
import { validateTransaction } from "./TransactionValidator";

describe(__filename, () => {

	// TODO: tests

	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	describe("method()", () => {

		it("should do something", () => {
			validateTransaction(DEFAULT_TRANSACTION);
		});
	});
});
