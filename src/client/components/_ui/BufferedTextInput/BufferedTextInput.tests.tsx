import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../test-utils/global.tests";
import { BufferedTextInput } from "./BufferedTextInput";

describe(__filename, () => {
  let { mountWrapper } = testGlobals;

  it("should pass the input props down to the input", () => {
    mountWrapper = mount(<BufferedTextInput inputProps={{ disabled: true }} />);
    mountWrapper
      .find("input")
      .props()
      .disabled.should.equal(true);
  });

  it("should not call the change listener immediately", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<BufferedTextInput onValueChange={spy} />);
    mountWrapper.find("input").simulate("change", { target: { value: "hello" } });
    mountWrapper.find("input").simulate("keyup");
    spy.notCalled.should.equal(true);
  });

  it("should call the change listener after a delay", (done) => {
    const spy = sinon.spy();
    mountWrapper = mount(<BufferedTextInput onValueChange={spy} delay={20} />);
    mountWrapper.find("input").simulate("keyup", { target: { value: "hello" } });
    setTimeout(() => {
      spy.calledOnceWithExactly("hello").should.equal(true);
      done();
    }, 30);
  });
});
