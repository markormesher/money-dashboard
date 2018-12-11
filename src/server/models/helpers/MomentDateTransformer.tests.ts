import { expect } from "chai";
import { afterEach, describe, it } from "mocha";
import * as Moment from "moment";
import * as sinon from "sinon";
import { Not } from "typeorm";
import { MomentDateTransformer } from "./MomentDateTransformer";

describe(__filename, () => {

	const sandbox = sinon.createSandbox();
	const transformer = new MomentDateTransformer();

	afterEach(() => {
		sandbox.restore();
	});

	describe("toDbFormat()", () => {

		it("should convert Moment dates to timestamps in seconds", () => {
			MomentDateTransformer.toDbFormat(Moment("1970-01-01").startOf("day").utc(true)).should.equal(0);
			MomentDateTransformer.toDbFormat(Moment("2015-04-01").startOf("day").utc(true)).should.equal(1427846400);
		});

		it("should pass on falsy values", () => {
			expect(MomentDateTransformer.toDbFormat(null)).to.equal(null);
			expect(MomentDateTransformer.toDbFormat(undefined)).to.equal(null);
		});

		it("should throw an exception for invalid values", () => {
			expect(() => MomentDateTransformer.toDbFormat(Moment("2018-01-40"))).to.throw();
		});
	});

	describe("fromDbFormat()", () => {

		it("should convert timestamps in seconds to Moment dates", () => {
			MomentDateTransformer.fromDbFormat(1427846400)
					.isSame(Moment("2015-04-01").startOf("day").utc(true)).should.equal(true);
		});

		it("should convert zero-values to Moment dates", () => {
			MomentDateTransformer.fromDbFormat(0)
					.isSame(Moment("1970-01-01").startOf("day").utc(true)).should.equal(true);
		});

		it("should pass on falsy, non-zero values", () => {
			expect(MomentDateTransformer.fromDbFormat(null)).to.equal(null);
			expect(MomentDateTransformer.fromDbFormat(undefined)).to.equal(null);
		});
	});

	describe("to()", () => {

		it("should not change FindOperator inputs", () => {
			const findOperator = Not("a");
			transformer.to(findOperator).should.equal(findOperator);
		});

		it("should pass all other calls to the static method (normal value)", () => {
			const stub = sandbox.stub(MomentDateTransformer, "toDbFormat");
			transformer.to(Moment("2015-04-01").startOf("day").utc(true));
			stub.calledOnce.should.equal(true);
		});

		it("should pass all other calls to the static method (falsy values)", () => {
			const stub = sandbox.stub(MomentDateTransformer, "toDbFormat");
			transformer.to(null);
			transformer.to(undefined);
			stub.calledTwice.should.equal(true);
		});

		it("should pass all other calls to the static method (invalid value)", () => {
			const stub = sandbox.stub(MomentDateTransformer, "toDbFormat");
			try {
				// this should throw
				transformer.to(Moment("2018-01-40"));
			} catch {
				// ...
			}
			stub.calledOnce.should.equal(true);
		});
	});

	describe("from()", () => {

		it("should pass all calls to the static method (normal value)", () => {
			const stub = sandbox.stub(MomentDateTransformer, "fromDbFormat");
			transformer.from(1000);
			stub.calledOnce.should.equal(true);
		});

		it("should pass all calls to the static method (zero)", () => {
			const stub = sandbox.stub(MomentDateTransformer, "fromDbFormat");
			transformer.from(0);
			stub.calledOnce.should.equal(true);
		});

		it("should pass all calls to the static method (falsy values)", () => {
			const stub = sandbox.stub(MomentDateTransformer, "fromDbFormat");
			transformer.from(null);
			transformer.from(undefined);
			stub.calledTwice.should.equal(true);
		});
	});
});
