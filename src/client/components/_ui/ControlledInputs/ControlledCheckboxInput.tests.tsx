import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../../test-utils/global.tests";
import { voidListener } from "../../../../../test-utils/test-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { ControlledCheckboxInput } from "./ControlledCheckboxInput";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should pass core props to the input", () => {
		mountWrapper = mount((
				<ControlledCheckboxInput
						id={"test-id"}
						label={"Test Label"}
						checked={false}
						disabled={false}
						onCheckedChange={voidListener}
				/>
		));
		mountWrapper.find("input").props().id.should.equal("test-id");
		mountWrapper.find("input").props().checked.should.equal(false);
		mountWrapper.find("input").props().disabled.should.equal(false);

		mountWrapper.setProps({
			id: "test-id2",
			checked: true,
			disabled: true,
		});
		mountWrapper.find("input").props().id.should.equal("test-id2");
		mountWrapper.find("input").props().checked.should.equal(true);
		mountWrapper.find("input").props().disabled.should.equal(true);
	});

	it("should pass extra props to the input", () => {
		mountWrapper = mount((
				<ControlledCheckboxInput
						id={"test-id"}
						label={"Test Label"}
						checked={false}
						onCheckedChange={voidListener}
						inputProps={{
							name: "test",
						}}
				/>
		));
		mountWrapper.find("input").props().name.should.equal("test");
	});

	it("should render a text label", () => {
		mountWrapper = mount((
				<ControlledCheckboxInput
						id={"test-id"}
						label={"Test Label"}
						checked={true}
						onCheckedChange={voidListener}
				/>
		));
		mountWrapper.find("label").length.should.equal(1);
		mountWrapper.find("label").text().should.equal("Test Label");
	});

	it("should render a react element label", () => {
		mountWrapper = mount((
				<ControlledCheckboxInput
						id={"test-id"}
						label={(<strong>Test Label</strong>)}
						checked={true}
						onCheckedChange={voidListener}
				/>
		));
		mountWrapper.find("label").length.should.equal(1);
		mountWrapper.find("label").find("strong").length.should.equal(1);
		mountWrapper.find("label").text().should.equal("Test Label");
	});

	it("should not render an error if none is provided", () => {
		mountWrapper = mount((
				<ControlledCheckboxInput
						id={"test-id"}
						label={"Test Label"}
						checked={true}
						onCheckedChange={voidListener}
				/>
		));
		mountWrapper.find("input").props().className.should.not.contain(bs.isInvalid);
		mountWrapper.find(`div.${bs.invalidFeedback}`).length.should.equal(0);
	});

	it("should not render an error if one is provided but the component is untouched", () => {
		mountWrapper = mount((
				<ControlledCheckboxInput
						id={"test-id"}
						label={"Test Label"}
						checked={true}
						onCheckedChange={voidListener}
						error={"Test error"}
				/>
		));
		mountWrapper.find("input").props().className.should.not.contain(bs.isInvalid);
		mountWrapper.find(`div.${bs.invalidFeedback}`).length.should.equal(0);
	});

	it("should render an error if one is provided and the component has been touched", () => {
		mountWrapper = mount((
				<ControlledCheckboxInput
						id={"test-id"}
						label={"Test Label"}
						checked={true}
						onCheckedChange={voidListener}
						error={"Test error"}
				/>
		));
		mountWrapper.find("input").simulate("blur");
		mountWrapper.update();
		mountWrapper.find("input").props().className.should.contain(bs.isInvalid);
		mountWrapper.find(`div.${bs.invalidFeedback}`).length.should.equal(1);
		mountWrapper.find(`div.${bs.invalidFeedback}`).text().should.equal("Test error");
	});

	it("should call the change listener when the value changes", () => {
		const spy = sinon.spy();
		mountWrapper = mount((
				<ControlledCheckboxInput
						id={"test-id"}
						label={"Test Label"}
						checked={true}
						onCheckedChange={spy}
				/>
		));
		mountWrapper.find("input").simulate("change");
		// value will be true because the simulated click doesn't actually flip the value
		spy.calledOnceWithExactly(true, "test-id").should.equal(true);
	});
});
