import { afterEach, describe } from "mocha";
import * as sinon from "sinon";
import { DEFAULT_BUDGET } from "../IBudget";
import { validateBudget } from "./BudgetValidator";

describe(__filename, () => {

	// TODO: tests

	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	describe("method()", () => {

		it("should do something", () => {
			validateBudget(DEFAULT_BUDGET);
		});
	});
});
