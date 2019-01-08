import { expect } from "chai";
import { afterEach, describe } from "mocha";
import * as sinon from "sinon";
import { mapEntitiesFromApi } from "./entities";

describe(__filename, () => {

	describe("mapEntitiesFrom()", () => {

		const spy = sinon.spy();

		afterEach(() => {
			spy.resetHistory();
		});

		it("return undefined for null/undefined inputs", () => {
			expect(mapEntitiesFromApi(spy, null)).to.equal(undefined);
			expect(mapEntitiesFromApi(spy, undefined)).to.equal(undefined);
			spy.notCalled.should.equal(true);
		});

		it("return an empty array for empty array inputs", () => {
			mapEntitiesFromApi(spy, []).should.deep.equal([]);
			spy.notCalled.should.equal(true);
		});

		it("should call the mapper for each value in the input array", () => {
			mapEntitiesFromApi(spy, ["val1", "val2"]);
			spy.callCount.should.equal(2);
			spy.firstCall.args[0].should.equal("val1");
			spy.secondCall.args[0].should.equal("val2");
		});
	});
});
