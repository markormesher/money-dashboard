import { afterEach, describe } from "mocha";
import * as sinon from "sinon";
import { validateDateRange } from "./DateRangeValidator";

describe(__filename, () => {

	// TODO: tests

	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	describe("method()", () => {

		it("should do something", () => {
			validateDateRange({});
		});
	});
});
