import { faCheckSquare, faSquare } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { should } from "chai";
import { mount, render } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../../test/global.tests";
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

	it("should call the click listener with the new value (true -> false)", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<CheckboxBtn checked={true} onChange={spy}/>);
		mountWrapper.find("button").simulate("click");
		spy.firstCall.args.should.have.lengthOf(1);
		spy.firstCall.args[0].should.equal(false);
	});

	it("should call the click listener with the new value (false -> true)", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<CheckboxBtn checked={false} onChange={spy}/>);
		mountWrapper.find("button").simulate("click");
		spy.firstCall.args.should.have.lengthOf(1);
		spy.firstCall.args[0].should.equal(true);
	});
});
