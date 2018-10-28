import { should } from "chai";
import { describe, it } from "mocha";
import { combine } from "../../../src/client/helpers/style-helpers";

should();

describe("helpers/style-helpers", () => {

	describe("combine()", () => {

		it("should concatenate input", () => {
			combine("a", "b", "c").should.equal("a b c");
		});

		it("should remove falsy values", () => {
			combine("a", false, undefined).should.equal("a");
		});
	});
});
