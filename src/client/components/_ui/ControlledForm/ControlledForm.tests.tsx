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
		mountWrapper = mount(<ControlledForm onSubmit={spy}/>);
		mountWrapper.find("form").simulate("submit");
		spy.calledOnce.should.equal(true);
	});

	it("should attach a document key listener on mount", () => {
		const spy = sinon.spy();
		const originalListener = document.addEventListener;
		document.addEventListener = spy;
		mountWrapper = mount(<ControlledForm/>);
		document.addEventListener = originalListener;
		spy.calledOnce.should.equal(true);
	});

	it("should remove the document key listener on unmount", () => {
		const spy = sinon.spy();
		const originalListener = document.removeEventListener;
		document.removeEventListener = spy;
		mountWrapper = mount(<ControlledForm/>);
		mountWrapper.unmount();
		document.removeEventListener = originalListener;
		spy.calledOnce.should.equal(true);
	});

	it("should call the listener when 'Ctrl + Enter' is pressed", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<ControlledForm onSubmit={spy}/>);
		const evt = new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true });
		document.dispatchEvent(evt);
		spy.calledOnce.should.equal(true);
	});

	it("should call the listener when 'Meta + Enter' is pressed", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<ControlledForm onSubmit={spy}/>);
		const evt = new KeyboardEvent("keydown", { key: "Enter", metaKey: true });
		document.dispatchEvent(evt);
		spy.calledOnce.should.equal(true);
	});

	it("should not call the listener when 'Enter' is pressed", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<ControlledForm onSubmit={spy}/>);
		const evt = new KeyboardEvent("keydown", { key: "Enter" });
		document.dispatchEvent(evt);
		spy.called.should.equal(false);
	});
});
