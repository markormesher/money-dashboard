import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../../test-utils/global.tests";
import { voidListener } from "../../../../../test-utils/test-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { ControlledRadioInput } from "./ControlledRadioInput";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should pass core props to the input", () => {
		mountWrapper = mount((
				<ControlledRadioInput
						id={"test-id"}
						name={"test-name"}
						value={"test-val"}
						label={"Test Label"}
						checked={false}
						disabled={false}
						onValueChange={voidListener}
				/>
		));
		mountWrapper.find("input").props().id.should.equal("test-id");
		mountWrapper.find("input").props().name.should.equal("test-name");
		mountWrapper.find("input").props().value.should.equal("test-val");
		mountWrapper.find("input").props().checked.should.equal(false);
		mountWrapper.find("input").props().disabled.should.equal(false);

		mountWrapper.setProps({
			id: "test-id2",
			name: "test-name2",
			value: "test-val2",
			checked: true,
			disabled: true,
		});
		mountWrapper.find("input").props().id.should.equal("test-id2");
		mountWrapper.find("input").props().name.should.equal("test-name2");
		mountWrapper.find("input").props().value.should.equal("test-val2");
		mountWrapper.find("input").props().checked.should.equal(true);
		mountWrapper.find("input").props().disabled.should.equal(true);
	});

	it("should pass extra props to the input", () => {
		mountWrapper = mount((
				<ControlledRadioInput
						id={"test-id"}
						name={"test-name"}
						value={"test-val"}
						label={"Test Label"}
						checked={true}
						onValueChange={voidListener}
						inputProps={{
							title: "test",
						}}
				/>
		));
		mountWrapper.find("input").props().title.should.equal("test");
	});

	it("should render a text label", () => {
		mountWrapper = mount((
				<ControlledRadioInput
						id={"test-id"}
						name={"test-name"}
						value={"test-val"}
						label={"Test Label"}
						checked={true}
						onValueChange={voidListener}
				/>
		));
		mountWrapper.find("label").length.should.equal(1);
		mountWrapper.find("label").text().should.equal("Test Label");
	});

	it("should render a react element label", () => {
		mountWrapper = mount((
				<ControlledRadioInput
						id={"test-id"}
						name={"test-name"}
						value={"test-val"}
						label={(<strong>Test Label</strong>)}
						checked={true}
						onValueChange={voidListener}
				/>
		));
		mountWrapper.find("label").length.should.equal(1);
		mountWrapper.find("label").find("strong").length.should.equal(1);
		mountWrapper.find("label").text().should.equal("Test Label");
	});

	it("should not render an error if none is provided", () => {
		mountWrapper = mount((
				<ControlledRadioInput
						id={"test-id"}
						name={"test-name"}
						value={"test-val"}
						label={"Test Label"}
						checked={true}
						onValueChange={voidListener}
				/>
		));
		mountWrapper.find("input").props().className.should.not.contain(bs.isInvalid);
		mountWrapper.find(`div.${bs.invalidFeedback}`).length.should.equal(0);
	});

	it("should not render an error if one is provided but the component is untouched", () => {
		mountWrapper = mount((
				<ControlledRadioInput
						id={"test-id"}
						name={"test-name"}
						value={"test-val"}
						label={"Test Label"}
						checked={true}
						onValueChange={voidListener}
						error={"Test error"}
				/>
		));
		mountWrapper.find("input").props().className.should.not.contain(bs.isInvalid);
		mountWrapper.find(`div.${bs.invalidFeedback}`).length.should.equal(0);
	});

	it("should render an error if one is provided and the component has been touched", () => {
		mountWrapper = mount((
				<ControlledRadioInput
						id={"test-id"}
						name={"test-name"}
						value={"test-val"}
						label={"Test Label"}
						checked={true}
						onValueChange={voidListener}
						error={"Test error"}
				/>
		));
		mountWrapper.find("input").simulate("blur");
		mountWrapper.update();
		mountWrapper.find("input").props().className.should.contain(bs.isInvalid);
		mountWrapper.find(`div.${bs.invalidFeedback}`).length.should.equal(1);
		mountWrapper.find(`div.${bs.invalidFeedback}`).text().should.equal("Test error");
	});

	it("should call the change listener when the value changes and is checked", () => {
		const spy = sinon.spy();
		mountWrapper = mount((
				<ControlledRadioInput
						id={"test-id"}
						name={"test-name"}
						value={"test-val"}
						label={"Test Label"}
						checked={true}
						onValueChange={spy}
				/>
		));
		mountWrapper.find("input").simulate("change");
		spy.calledOnceWithExactly("test-val", "test-id").should.equal(true);
	});

	it("should not call the change listener when the value changes and is not checked", () => {
		const spy = sinon.spy();
		mountWrapper = mount((
				<ControlledRadioInput
						id={"test-id"}
						name={"test-name"}
						value={"test-val"}
						label={"Test Label"}
						checked={false}
						onValueChange={spy}
				/>
		));
		mountWrapper.find("input").simulate("change");
		spy.notCalled.should.equal(true);
	});
});
