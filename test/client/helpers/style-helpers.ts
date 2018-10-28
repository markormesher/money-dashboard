import { expect } from "chai";
import { describe, it } from "mocha";
import { combine } from "../../../src/client/helpers/style-helpers";

describe("helpers/style-helpers", () => {

	describe("combine()", () => {

		it("should concatenate input", () => {
			const result = combine("a", "b", "c");
			expect(result).to.equal("a b c");
		});

		it("should remove falsy values", () => {
			const result = combine("a", false, undefined);
			expect(result).to.equal("a");
		});
	});
});
