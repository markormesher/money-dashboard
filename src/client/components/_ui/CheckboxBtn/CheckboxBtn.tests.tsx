import { faCheckSquare, faSquare } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mount, render } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../test-utils/global.tests";
import { CheckboxBtn } from "./CheckboxBtn";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should render the text", () => {
		const wrapper = render(<CheckboxBtn text={"hello"}/>);
		wrapper.text().should.equal("hello");
	});

	it("should render the checkbox icon when checked", () => {
		mountWrapper = mount(<CheckboxBtn checked={true}/>);
		mountWrapper.find(FontAwesomeIcon).should.have.lengthOf(1);
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faCheckSquare);
	});

	it("should render the empty box icon when not checked", () => {
		mountWrapper = mount(<CheckboxBtn checked={false}/>);
		mountWrapper.find(FontAwesomeIcon).should.have.lengthOf(1);
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faSquare);
	});

	it("should change the icon when new props are given", () => {
		mountWrapper = mount(<CheckboxBtn checked={true}/>);
		const iconBeforeChange = mountWrapper.find(FontAwesomeIcon).props().icon;

		mountWrapper.setProps({ checked: false });
		const iconAfterChange = mountWrapper.find(FontAwesomeIcon).props().icon;

		iconBeforeChange.should.not.equal(iconAfterChange);
	});

	it("should pass the button props down to the button", () => {
		mountWrapper = mount(<CheckboxBtn btnProps={{ disabled: true }}/>);
		mountWrapper.find("button").props().disabled.should.equal(true);
	});

	it("should call the change listener with the new value (true -> false)", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<CheckboxBtn checked={true} onChange={spy}/>);
		mountWrapper.find("button").simulate("click");
		spy.calledOnceWithExactly(false).should.equal(true);
	});

	it("should call the change listener with the new value (false -> true)", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<CheckboxBtn checked={false} onChange={spy}/>);
		mountWrapper.find("button").simulate("click");
		spy.calledOnceWithExactly(true).should.equal(true);
	});

	it("should pass the payload to the change listener (true -> false)", () => {
		const spy = sinon.spy();
		const payload = { hello: 42 };
		mountWrapper = mount(<CheckboxBtn checked={true} payload={payload} onChange={spy}/>);
		mountWrapper.find("button").simulate("click");
		spy.calledOnceWithExactly(false, payload).should.equal(true);
	});

	it("should pass the payload to the change listener (false -> true)", () => {
		const spy = sinon.spy();
		const payload = { hello: 42 };
		mountWrapper = mount(<CheckboxBtn checked={false} payload={payload} onChange={spy}/>);
		mountWrapper.find("button").simulate("click");
		spy.calledOnceWithExactly(true, payload).should.equal(true);
	});

	it("should not fail when clicked without a listener (true -> false)", () => {
		mountWrapper = mount(<CheckboxBtn checked={true}/>);
		mountWrapper.find("button").simulate("click");
	});

	it("should not fail when clicked without a listener (false -> true)", () => {
		mountWrapper = mount(<CheckboxBtn checked={false}/>);
		mountWrapper.find("button").simulate("click");
	});
});
