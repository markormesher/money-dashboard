import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../test-utils/global.tests";
import { MaterialIcon } from "../MaterialIcon/MaterialIcon";
import { removeIconText } from "../../../../test-utils/test-helpers";
import { CheckboxBtn } from "./CheckboxBtn";

describe(__filename, () => {
  let { mountWrapper } = testGlobals;

  it("should render the text", () => {
    mountWrapper = mount(<CheckboxBtn text={"hello"} />);
    removeIconText(mountWrapper);
    mountWrapper.text().should.equal("hello");
  });

  it("should render the checkbox icon by default when checked", () => {
    mountWrapper = mount(<CheckboxBtn checked={true} />);
    mountWrapper.find(MaterialIcon).should.have.lengthOf(1);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .icon.should.equal("check_box");
  });

  it("should render a custom icon if specified when checked", () => {
    mountWrapper = mount(<CheckboxBtn checked={true} iconChecked={"check_circle"} />);
    mountWrapper.find(MaterialIcon).should.have.lengthOf(1);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .icon.should.equal("check_circle");
  });

  it("should render the empty box icon by default when not checked", () => {
    mountWrapper = mount(<CheckboxBtn checked={false} />);
    mountWrapper.find(MaterialIcon).should.have.lengthOf(1);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .icon.should.equal("check_box_outline_blank");
  });

  it("should render the empty box icon if specified when not checked", () => {
    mountWrapper = mount(<CheckboxBtn checked={false} iconUnchecked={"circle"} />);
    mountWrapper.find(MaterialIcon).should.have.lengthOf(1);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .icon.should.equal("circle");
  });

  it("should change the icon when new props are given", () => {
    mountWrapper = mount(<CheckboxBtn checked={true} />);
    const iconBeforeChange = mountWrapper.find(MaterialIcon).props().icon;

    mountWrapper.setProps({ checked: false });
    const iconAfterChange = mountWrapper.find(MaterialIcon).props().icon;

    iconBeforeChange.should.not.equal(iconAfterChange);
  });

  it("should pass the button props down to the button", () => {
    mountWrapper = mount(<CheckboxBtn btnProps={{ disabled: true }} />);
    mountWrapper
      .find("button")
      .props()
      .disabled.should.equal(true);
  });

  it("should call the change listener with the new value (true -> false)", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<CheckboxBtn checked={true} onChange={spy} />);
    mountWrapper.find("button").simulate("click");
    spy.calledOnceWithExactly(false).should.equal(true);
  });

  it("should call the change listener with the new value (false -> true)", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<CheckboxBtn checked={false} onChange={spy} />);
    mountWrapper.find("button").simulate("click");
    spy.calledOnceWithExactly(true).should.equal(true);
  });

  it("should pass the payload to the change listener (true -> false)", () => {
    const spy = sinon.spy();
    const payload = { hello: 42 };
    mountWrapper = mount(<CheckboxBtn checked={true} payload={payload} onChange={spy} />);
    mountWrapper.find("button").simulate("click");
    spy.calledOnceWithExactly(false, payload).should.equal(true);
  });

  it("should pass the payload to the change listener (false -> true)", () => {
    const spy = sinon.spy();
    const payload = { hello: 42 };
    mountWrapper = mount(<CheckboxBtn checked={false} payload={payload} onChange={spy} />);
    mountWrapper.find("button").simulate("click");
    spy.calledOnceWithExactly(true, payload).should.equal(true);
  });

  it("should not fail when clicked without a listener (true -> false)", () => {
    mountWrapper = mount(<CheckboxBtn checked={true} />);
    mountWrapper.find("button").simulate("click");
  });

  it("should not fail when clicked without a listener (false -> true)", () => {
    mountWrapper = mount(<CheckboxBtn checked={false} />);
    mountWrapper.find("button").simulate("click");
  });
});
