import { should } from "chai";
import { mount, render } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../test-utils/global.tests";
import { DateModeToggleBtn } from "./DateModeToggleBtn";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should render a label for transaction mode", () => {
		mountWrapper = mount(<DateModeToggleBtn value={"transaction"}/>);
		mountWrapper.text().should.containIgnoreCase("transaction");
	});

	it("should render a label for effective mode", () => {
		const wrapper = render(<DateModeToggleBtn value={"effective"}/>);
		wrapper.text().should.containIgnoreCase("effective");
	});

	it("should change the label when new props are given", () => {
		mountWrapper = mount(<DateModeToggleBtn value={"transaction"}/>);
		const labelBeforeChange = mountWrapper.text();

		mountWrapper.setProps({ value: "effective" });
		const iconBeforeChange = mountWrapper.text();

		labelBeforeChange.should.not.equal(iconBeforeChange);
	});

	it("should pass the button props down to the button", () => {
		mountWrapper = mount(<DateModeToggleBtn btnProps={{ disabled: true }}/>);
		mountWrapper.find("button").props().disabled.should.equal(true);
	});

	it("should call the click listener with the new value (E -> T)", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<DateModeToggleBtn value={"effective"} onChange={spy}/>);
		mountWrapper.find("button").simulate("click");
		spy.calledOnceWithExactly("transaction").should.equal(true);
	});

	it("should call the click listener with the new value (T -> E)", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<DateModeToggleBtn value={"transaction"} onChange={spy}/>);
		mountWrapper.find("button").simulate("click");
		spy.calledOnceWithExactly("effective").should.equal(true);
	});

	it("should not fail when clicked without a listener (E -> T)", () => {
		mountWrapper = mount(<DateModeToggleBtn value={"effective"}/>);
		mountWrapper.find("button").simulate("click");
	});

	it("should not fail when clicked without a listener (T -> E)", () => {
		mountWrapper = mount(<DateModeToggleBtn value={"transaction"}/>);
		mountWrapper.find("button").simulate("click");
	});
});
