import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../../test/global.tests";
import { voidListener } from "../../../../../test/test-helpers";
import { ControlledForm } from "./ControlledForm";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should render children", () => {
		mountWrapper = mount((
				<ControlledForm onSubmit={voidListener}>
					<span>child</span>
				</ControlledForm>
		));
		mountWrapper.find("span").length.should.equal(1);
		mountWrapper.find("span").text().should.equal("child");
	});

	it("should call the listener when submitted", () => {
		const spy = sinon.spy();
		mountWrapper = mount((
				<ControlledForm onSubmit={spy}/>
		));
		mountWrapper.find("form").simulate("submit");
		spy.calledOnce.should.equal(true);
	});
});
