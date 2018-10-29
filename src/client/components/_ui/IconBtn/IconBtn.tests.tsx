import { faRocket } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { should } from "chai";
import { mount, render } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../../test/global.tests";
import { IconBtn } from "./IconBtn";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should render the text", () => {
		const wrapper = render(<IconBtn text={"hello"} icon={faRocket}/>);
		wrapper.text().should.equal("hello");
	});

	it("should render the icon", () => {
		mountWrapper = mount(<IconBtn icon={faRocket}/>);
		mountWrapper.find(FontAwesomeIcon).should.have.lengthOf(1);
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faRocket);
	});

	it("should pass the button props down to the button", () => {
		mountWrapper = mount(<IconBtn icon={faRocket} btnProps={{ disabled: true }}/>);
		mountWrapper.find("button").props().disabled.should.equal(true);
	});

	it("should pass the icon props down to the icon", () => {
		mountWrapper = mount(<IconBtn icon={faRocket} iconProps={{ spin: true }}/>);
		mountWrapper.find(FontAwesomeIcon).props().spin.should.equal(true);
	});

	it("should call the click listener when clicked", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<IconBtn icon={faRocket} onClick={spy}/>);
		mountWrapper.find("button").simulate("click");
		spy.calledOnce.should.equal(true);
	});

	it("should pass the payload to the click listener", () => {
		const spy = sinon.spy();
		const payload = { hello: 42 };
		mountWrapper = mount(<IconBtn icon={faRocket} payload={payload} onClick={spy}/>);
		mountWrapper.find("button").simulate("click");
		spy.firstCall.args.should.have.lengthOf(1);
		spy.firstCall.args[0].should.equal(payload);
	});
});
