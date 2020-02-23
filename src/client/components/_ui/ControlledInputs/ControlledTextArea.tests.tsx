import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../test-utils/global.tests";
import { voidListener } from "../../../../test-utils/test-helpers";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { ControlledTextArea } from "./ControlledTextArea";

describe(__filename, () => {
  let { mountWrapper } = testGlobals;

  it("should pass core props to the input", () => {
    mountWrapper = mount(
      <ControlledTextArea
        id={"test-id"}
        value={"test-val"}
        placeholder={"test-placeholder"}
        label={"Test Label"}
        disabled={false}
        onValueChange={voidListener}
      />,
    );
    mountWrapper
      .find("textarea")
      .props()
      .id.should.equal("test-id");
    mountWrapper
      .find("textarea")
      .props()
      .value.should.equal("test-val");
    mountWrapper
      .find("textarea")
      .props()
      .placeholder.should.equal("test-placeholder");
    mountWrapper
      .find("textarea")
      .props()
      .disabled.should.equal(false);

    mountWrapper.setProps({
      id: "test-id2",
      value: "test-val2",
      placeholder: "test-placeholder2",
      checked: true,
      disabled: true,
    });
    mountWrapper
      .find("textarea")
      .props()
      .id.should.equal("test-id2");
    mountWrapper
      .find("textarea")
      .props()
      .value.should.equal("test-val2");
    mountWrapper
      .find("textarea")
      .props()
      .placeholder.should.equal("test-placeholder2");
    mountWrapper
      .find("textarea")
      .props()
      .disabled.should.equal(true);
  });

  it("should pass extra props to the input", () => {
    mountWrapper = mount(
      <ControlledTextArea
        id={"test-id"}
        value={"test-val"}
        placeholder={"test-placeholder"}
        label={"Test Label"}
        onValueChange={voidListener}
        inputProps={{
          title: "test",
        }}
      />,
    );
    mountWrapper
      .find("textarea")
      .props()
      .title.should.equal("test");
  });

  it("should use an empty strings when the placeholder is not defined", () => {
    mountWrapper = mount(
      <ControlledTextArea id={"test-id"} value={"test-val"} label={"Test Label"} onValueChange={voidListener} />,
    );
    mountWrapper
      .find("textarea")
      .props()
      .placeholder.should.equal("");
  });

  it("should use an empty strings when the value is null", () => {
    mountWrapper = mount(
      <ControlledTextArea
        id={"test-id"}
        value={null}
        placeholder={"test-placeholder"}
        label={"Test Label"}
        onValueChange={voidListener}
      />,
    );
    mountWrapper
      .find("textarea")
      .props()
      .value.should.equal("");
  });

  it("should use an empty strings when the value is undefined", () => {
    mountWrapper = mount(
      <ControlledTextArea
        id={"test-id"}
        value={undefined}
        placeholder={"test-placeholder"}
        label={"Test Label"}
        onValueChange={voidListener}
      />,
    );
    mountWrapper
      .find("textarea")
      .props()
      .value.should.equal("");
  });

  it("should render a text label", () => {
    mountWrapper = mount(
      <ControlledTextArea
        id={"test-id"}
        value={"test-val"}
        placeholder={"test-placeholder"}
        label={"Test Label"}
        onValueChange={voidListener}
      />,
    );
    mountWrapper.find("label").length.should.equal(1);
    mountWrapper
      .find("label")
      .text()
      .should.equal("Test Label");
  });

  it("should render a react element label", () => {
    mountWrapper = mount(
      <ControlledTextArea
        id={"test-id"}
        value={"test-val"}
        placeholder={"test-placeholder"}
        label={<strong>Test Label</strong>}
        onValueChange={voidListener}
      />,
    );
    mountWrapper.find("label").length.should.equal(1);
    mountWrapper
      .find("label")
      .find("strong")
      .length.should.equal(1);
    mountWrapper
      .find("label")
      .text()
      .should.equal("Test Label");
  });

  it("should not render an error if none is provided", () => {
    mountWrapper = mount(
      <ControlledTextArea
        id={"test-id"}
        value={"test-val"}
        placeholder={"test-placeholder"}
        label={"Test Label"}
        onValueChange={voidListener}
      />,
    );
    mountWrapper
      .find("textarea")
      .props()
      .className.should.not.contain(bs.isInvalid);
    mountWrapper.find(`div.${bs.invalidFeedback}`).length.should.equal(0);
  });

  it("should not render an error if one is provided but the component is untouched", () => {
    mountWrapper = mount(
      <ControlledTextArea
        id={"test-id"}
        value={"test-val"}
        placeholder={"test-placeholder"}
        label={"Test Label"}
        onValueChange={voidListener}
        error={"Test error"}
      />,
    );
    mountWrapper
      .find("textarea")
      .props()
      .className.should.not.contain(bs.isInvalid);
    mountWrapper.find(`div.${bs.invalidFeedback}`).length.should.equal(0);
  });

  it("should render an error if one is provided and the component has been touched", () => {
    mountWrapper = mount(
      <ControlledTextArea
        id={"test-id"}
        value={"test-val"}
        placeholder={"test-placeholder"}
        label={"Test Label"}
        onValueChange={voidListener}
        error={"Test error"}
      />,
    );
    mountWrapper.find("textarea").simulate("blur");
    mountWrapper.update();
    mountWrapper
      .find("textarea")
      .props()
      .className.should.contain(bs.isInvalid);
    mountWrapper.find(`div.${bs.invalidFeedback}`).length.should.equal(1);
    mountWrapper
      .find(`div.${bs.invalidFeedback}`)
      .text()
      .should.equal("Test error");
  });

  it("should call the change listener when the value changes", () => {
    const spy = sinon.spy();
    mountWrapper = mount(
      <ControlledTextArea
        id={"test-id"}
        value={"test-val"}
        placeholder={"test-placeholder"}
        label={"Test Label"}
        onValueChange={spy}
      />,
    );
    mountWrapper.find("textarea").simulate("change", { target: { value: "new-val" } });
    spy.calledOnceWithExactly("new-val", "test-id").should.equal(true);
  });
});
