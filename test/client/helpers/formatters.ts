import * as chai from "chai";
import { expect } from "chai";
import * as chaiString from "chai-string";
import { describe, it } from "mocha";
import { formatCurrency } from "../../../src/client/helpers/formatters";

chai.use(chaiString);

describe("helpers/formatters", () => {

	describe("generateBadge()", () => {
		// todo
	});

	describe("formatCurrency()", () => {

		it("should force two decimal places", () => {
			expect(formatCurrency(0)).to.endsWith(".00");
			expect(formatCurrency(0.5)).to.endsWith(".50");
			expect(formatCurrency(0.001)).to.endsWith(".00");
		});

		it("should group thousands", () => {
			expect(formatCurrency(1)).to.equal("1.00");
			expect(formatCurrency(1000)).to.equal("1,000.00");
			expect(formatCurrency(1000000)).to.equal("1,000,000.00");
		});

		it("should preserve negatives", () => {
			expect(formatCurrency(1)).to.equal("1.00");
			expect(formatCurrency(-1)).to.equal("-1.00");
		});
	});

	describe("formatCurrencyStyled()", () => {
		// todo
	});
});
