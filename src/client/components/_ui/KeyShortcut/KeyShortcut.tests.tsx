import { expect } from "chai";
import { mount } from "enzyme";
import { afterEach, describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../../test-utils/global.tests";
import { voidListener } from "../../../../../test-utils/test-helpers";
import { KeyShortcut } from "./KeyShortcut";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;
	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.restore();
	});

	it("should not render anything by default", () => {
		mountWrapper = mount(<KeyShortcut targetStr={"a"} onTrigger={voidListener}/>);
		expect(mountWrapper.html()).to.equal(null);
	});

	it("should render children without wrapping them", () => {
		mountWrapper = mount((
				<KeyShortcut targetStr={"a"} onTrigger={voidListener}>
					<span>test</span>
				</KeyShortcut>
		));
		mountWrapper.html().should.to.equal("<span>test</span>");
	});

	it("should attach a document key listener on mount", () => {
		const spy = sinon.spy();
		sandbox.stub(document, "addEventListener").callsFake(spy);
		mountWrapper = mount(<KeyShortcut targetStr={"a"} onTrigger={voidListener}/>);
		spy.calledOnce.should.equal(true);
	});

	it("should remove the document key listener on unmount", () => {
		const spy = sinon.spy();
		sandbox.stub(document, "removeEventListener").callsFake(spy);
		mountWrapper = mount(<KeyShortcut targetStr={"a"} onTrigger={voidListener}/>);
		mountWrapper.unmount();
		spy.calledOnce.should.equal(true);
	});

	it("should respond to matching key presses (single character)", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<KeyShortcut targetStr={"a"} onTrigger={spy}/>);
		document.dispatchEvent(new KeyboardEvent("keypress", { key: "a" }));
		spy.calledOnce.should.equal(true);
	});

	it("should respond to matching key presses after other presses (single character)", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<KeyShortcut targetStr={"a"} onTrigger={spy}/>);
		document.dispatchEvent(new KeyboardEvent("keypress", { key: "x" }));
		document.dispatchEvent(new KeyboardEvent("keypress", { key: "y" }));
		spy.called.should.equal(false);
		document.dispatchEvent(new KeyboardEvent("keypress", { key: "a" }));
		spy.calledOnce.should.equal(true);
	});

	it("should respond to matching key presses (multiple characters)", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<KeyShortcut targetStr={"ab"} onTrigger={spy}/>);
		document.dispatchEvent(new KeyboardEvent("keypress", { key: "a" }));
		spy.called.should.equal(false);
		document.dispatchEvent(new KeyboardEvent("keypress", { key: "b" }));
		spy.calledOnce.should.equal(true);
	});

	it("should respond to matching key presses after other presses (multiple characters)", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<KeyShortcut targetStr={"ab"} onTrigger={spy}/>);
		document.dispatchEvent(new KeyboardEvent("keypress", { key: "x" }));
		document.dispatchEvent(new KeyboardEvent("keypress", { key: "y" }));
		spy.called.should.equal(false);
		document.dispatchEvent(new KeyboardEvent("keypress", { key: "a" }));
		spy.called.should.equal(false);
		document.dispatchEvent(new KeyboardEvent("keypress", { key: "b" }));
		spy.calledOnce.should.equal(true);
	});

	it("should ignore key presses sent to a non-input element", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<KeyShortcut targetStr={"a"} onTrigger={spy}/>);
		const evt = new KeyboardEvent("keypress", { key: "a" });
		Object.defineProperty(evt, "target", { writable: false, value: document.createElement("dir") });
		document.dispatchEvent(evt);
		spy.calledOnce.should.equal(true);
	});

	it("should ignore key presses sent to an input", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<KeyShortcut targetStr={"a"} onTrigger={spy}/>);
		const evt = new KeyboardEvent("keypress", { key: "a" });
		Object.defineProperty(evt, "target", { writable: false, value: document.createElement("input") });
		document.dispatchEvent(evt);
		spy.notCalled.should.equal(true);
	});

	it("should ignore key presses sent to a select input", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<KeyShortcut targetStr={"a"} onTrigger={spy}/>);
		const evt = new KeyboardEvent("keypress", { key: "a" });
		Object.defineProperty(evt, "target", { writable: false, value: document.createElement("select") });
		document.dispatchEvent(evt);
		spy.notCalled.should.equal(true);
	});

	it("should ignore key presses sent to a text area", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<KeyShortcut targetStr={"a"} onTrigger={spy}/>);
		const evt = new KeyboardEvent("keypress", { key: "a" });
		Object.defineProperty(evt, "target", { writable: false, value: document.createElement("textarea") });
		document.dispatchEvent(evt);
		spy.notCalled.should.equal(true);
	});
});
