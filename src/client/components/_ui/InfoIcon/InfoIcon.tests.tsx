import { faInfoCircle, faRocket } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../test-utils/global.tests";
import { InfoIcon } from "./InfoIcon";

describe(__filename, () => {
  let { mountWrapper } = testGlobals;

  it("should render an info icon by default", () => {
    mountWrapper = mount(<InfoIcon hoverText={"hello"} />);
    mountWrapper.find(FontAwesomeIcon).should.have.lengthOf(1);
    mountWrapper
      .find(FontAwesomeIcon)
      .props()
      .icon.should.equal(faInfoCircle);
  });

  it("should render a custom icon if specified", () => {
    mountWrapper = mount(<InfoIcon hoverText={"hello"} customIcon={faRocket} />);
    mountWrapper.find(FontAwesomeIcon).should.have.lengthOf(1);
    mountWrapper
      .find(FontAwesomeIcon)
      .props()
      .icon.should.equal(faRocket);
  });

  it("should add the tooltip text", () => {
    mountWrapper = mount(<InfoIcon hoverText={"hello"} />);
    mountWrapper
      .find("span")
      .prop("data-tip")
      .should.equal("hello");
  });

  it("should call the click listener when clicked", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<InfoIcon hoverText={"hello"} onClick={spy} />);
    mountWrapper.find("svg").simulate("click");
    spy.calledOnce.should.equal(true);
  });

  it("should pass the payload to the click listener", () => {
    const spy = sinon.spy();
    const payload = { hello: 42 };
    mountWrapper = mount(<InfoIcon hoverText={"hello"} payload={payload} onClick={spy} />);
    mountWrapper.find("svg").simulate("click");
    spy.calledOnceWithExactly(payload).should.equal(true);
  });

  it("should not fail when clicked without a listener", () => {
    mountWrapper = mount(<InfoIcon hoverText={"hello"} />);
    mountWrapper.find("svg").simulate("click");
  });
});
