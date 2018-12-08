import { faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { should } from "chai";
import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../../test/global.tests";
import { IconBtn } from "../IconBtn/IconBtn";
import { DeleteBtn } from "./DeleteBtn";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should pass the button props down to the button", () => {
		mountWrapper = mount(<DeleteBtn btnProps={{ disabled: true }}/>);
		mountWrapper.find("button").props().disabled.should.equal(true);
	});

	it("should change the icon on click", () => {
		mountWrapper = mount(<DeleteBtn/>);
		const iconBeforeClick = mountWrapper.find(IconBtn).props().icon;
		mountWrapper.find("button").simulate("click");
		const iconAfterClick = mountWrapper.find(IconBtn).props().icon;
		iconBeforeClick.should.not.equal(iconAfterClick);
	});

	it("should change the label on click", () => {
		mountWrapper = mount(<DeleteBtn/>);
		const textBeforeClick = mountWrapper.text();
		mountWrapper.find("button").simulate("click");
		const textAfterClick = mountWrapper.text();
		textBeforeClick.should.not.equal(textAfterClick);
	});

	it("should restore all state when the trigger times out", (done) => {
		mountWrapper = mount(<DeleteBtn timeout={20}/>);
		const htmlBeforeClick = mountWrapper.html();
		mountWrapper.find("button").simulate("click");
		setTimeout(() => {
			const htmlAfterClick = mountWrapper.html();
			htmlBeforeClick.should.equal(htmlAfterClick);
			done();
		}, 30);
	});

	it("should lock when triggered", () => {
		mountWrapper = mount(<DeleteBtn/>);
		mountWrapper.find("button").simulate("click");
		mountWrapper.find("button").simulate("click");
		mountWrapper.find("button").props().disabled.should.equal(true);
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faCircleNotch);
		mountWrapper.find(FontAwesomeIcon).props().spin.should.equal(true);
	});

	it("should not call the click listener when clicked once", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<DeleteBtn onConfirmedClick={spy}/>);
		mountWrapper.find("button").simulate("click");
		spy.notCalled.should.equal(true);
	});

	it("should not call the click listener when clicked twice with a delay", (done) => {
		const spy = sinon.spy();
		mountWrapper = mount(<DeleteBtn timeout={20} onConfirmedClick={spy}/>);
		mountWrapper.find("button").simulate("click");
		setTimeout(() => {
			mountWrapper.find("button").simulate("click");
			spy.notCalled.should.equal(true);
			done();
		}, 30);
	});

	it("should call the click listener when clicked twice", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<DeleteBtn onConfirmedClick={spy}/>);
		mountWrapper.find("button").simulate("click");
		mountWrapper.find("button").simulate("click");
		spy.calledOnce.should.equal(true);
	});

	it("should not call the click listener again when already triggered", (done) => {
		const spy = sinon.spy();
		mountWrapper = mount(<DeleteBtn onConfirmedClick={spy}/>);
		mountWrapper.find("button").simulate("click");
		mountWrapper.find("button").simulate("click");
		spy.calledOnce.should.equal(true);
		setTimeout(() => {
			mountWrapper.find("button").simulate("click");
			spy.calledOnce.should.equal(true);
			done();
		}, 30);
	}).timeout(50);

	it("should pass the payload to the click listener", () => {
		const spy = sinon.spy();
		const payload = { hello: 42 };
		mountWrapper = mount(<DeleteBtn payload={payload} onConfirmedClick={spy}/>);
		mountWrapper.find("button").simulate("click");
		mountWrapper.find("button").simulate("click");
		spy.calledOnceWithExactly(payload).should.equal(true);
	});
});
