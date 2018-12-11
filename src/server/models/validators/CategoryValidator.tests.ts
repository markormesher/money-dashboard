import { afterEach, describe } from "mocha";
import * as sinon from "sinon";
import { DEFAULT_CATEGORY } from "../ICategory";
import { validateCategory } from "./CategoryValidator";

describe(__filename, () => {

	// TODO: tests

	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	describe("method()", () => {

		it("should do something", () => {
			validateCategory(DEFAULT_CATEGORY);
		});
	});
});
