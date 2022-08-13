import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../test-utils/global.tests";
import { MaterialIcon } from "../MaterialIcon/MaterialIcon";
import { removeIconText } from "../../../../test-utils/test-helpers";
import { IconBtn } from "./IconBtn";

describe(__filename, () => {
  let { mountWrapper } = testGlobals;

  it("should render the text", () => {
    mountWrapper = mount(<IconBtn text={"hello"} icon={"rocket"} />);
    removeIconText(mountWrapper);
    mountWrapper.text().should.equal("hello");
  });

  it("should render the icon", () => {
    mountWrapper = mount(<IconBtn icon={"rocket"} />);
    mountWrapper.find(MaterialIcon).should.have.lengthOf(1);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .icon.should.equal("rocket");
  });

  it("should pass the button props down to the button", () => {
    mountWrapper = mount(<IconBtn icon={"rocket"} btnProps={{ disabled: true }} />);
    mountWrapper
      .find("button")
      .props()
      .disabled.should.equal(true);
  });

  it("should pass the icon props down to the icon", () => {
    mountWrapper = mount(<IconBtn icon={"rocket"} iconProps={{ spin: true }} />);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .spin.should.equal(true);
  });

  it("should call the click listener when clicked", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<IconBtn icon={"rocket"} onClick={spy} />);
    mountWrapper.find("button").simulate("click");
    spy.calledOnce.should.equal(true);
  });

  it("should pass the payload to the click listener", () => {
    const spy = sinon.spy();
    const payload = { hello: 42 };
    mountWrapper = mount(<IconBtn icon={"rocket"} payload={payload} onClick={spy} />);
    mountWrapper.find("button").simulate("click");
    spy.calledOnceWithExactly(payload).should.equal(true);
  });

  it("should not fail when clicked without a listener", () => {
    mountWrapper = mount(<IconBtn icon={"rocket"} />);
    mountWrapper.find("button").simulate("click");
  });
});
