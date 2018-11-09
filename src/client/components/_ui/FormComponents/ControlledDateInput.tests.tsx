import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../../test/global.tests";
import { voidListener } from "../../../../../test/test-helpers";
import * as bs from "../../../bootstrap-aliases";
import { ControlledDateInput } from "./ControlledDateInput";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should pass core props to the input", () => {
		mountWrapper = mount((
				<ControlledDateInput
						id={"test-id"}
						value={"2015-04-01"}
						label={"Test Label"}
						disabled={false}
						onValueChange={voidListener}
				/>
		));
		mountWrapper.find("input").props().id.should.equal("test-id");
		mountWrapper.find("input").props().value.should.equal("2015-04-01");
		mountWrapper.find("input").props().disabled.should.equal(false);

		mountWrapper.setProps({
			id: "test-id2",
			value: "2015-04-02",
			checked: true,
			disabled: true,
		});
		mountWrapper.find("input").props().id.should.equal("test-id2");
		mountWrapper.find("input").props().value.should.equal("2015-04-02");
		mountWrapper.find("input").props().disabled.should.equal(true);
	});

	it("should pass extra props to the input", () => {
		mountWrapper = mount((
				<ControlledDateInput
						id={"test-id"}
						value={"2015-04-01"}
						label={"Test Label"}
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
				<ControlledDateInput
						id={"test-id"}
						value={"2015-04-01"}
						label={"Test Label"}
						onValueChange={voidListener}
				/>
		));
		mountWrapper.find("label").length.should.equal(1);
		mountWrapper.find("label").text().should.equal("Test Label");
	});

	it("should render a react element label", () => {
		mountWrapper = mount((
				<ControlledDateInput
						id={"test-id"}
						value={"2015-04-01"}
						label={(<strong>Test Label</strong>)}
						onValueChange={voidListener}
				/>
		));
		mountWrapper.find("label").length.should.equal(1);
		mountWrapper.find("label").find("strong").length.should.equal(1);
		mountWrapper.find("label").text().should.equal("Test Label");
	});

	it("should not render an error if none is provided", () => {
		mountWrapper = mount((
				<ControlledDateInput
						id={"test-id"}
						value={"2015-04-01"}
						label={"Test Label"}
						onValueChange={voidListener}
				/>
		));
		mountWrapper.find("input").props().className.should.not.contain(bs.isInvalid);
		mountWrapper.find(`div.${bs.invalidFeedback}`).length.should.equal(0);
	});

	it("should not render an error if one is provided but the component is untouched", () => {
		mountWrapper = mount((
				<ControlledDateInput
						id={"test-id"}
						value={"2015-04-01"}
						label={"Test Label"}
						onValueChange={voidListener}
						error={"Test error"}
				/>
		));
		mountWrapper.find("input").props().className.should.not.contain(bs.isInvalid);
		mountWrapper.find(`div.${bs.invalidFeedback}`).length.should.equal(0);
	});

	it("should render an error if one is provided and the component has been touched", () => {
		mountWrapper = mount((
				<ControlledDateInput
						id={"test-id"}
						value={"2015-04-01"}
						label={"Test Label"}
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

	it("should call the change listener when the value changes", () => {
		const spy = sinon.spy();
		mountWrapper = mount((
				<ControlledDateInput
						id={"test-id"}
						value={"2015-04-01"}
						label={"Test Label"}
						onValueChange={spy}
				/>
		));
		mountWrapper.find("input").simulate("change", { target: { value: "2015-04-02" } });
		spy.calledOnceWithExactly("2015-04-02", "test-id").should.equal(true);
	});
});
