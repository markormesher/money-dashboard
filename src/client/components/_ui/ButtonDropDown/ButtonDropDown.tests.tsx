import { mount, ReactWrapper } from "enzyme";
import { describe, it } from "mocha";
import { faRocket } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import * as sinon from "sinon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { testGlobals } from "../../../../test-utils/global.tests";
import { IconBtn } from "../IconBtn/IconBtn";
import { ButtonDropDown } from "./ButtonDropDown";
import * as styles from "./ButtonDropDown.scss";

describe(__filename, () => {
  let { mountWrapper } = testGlobals;

  function findChooser(): ReactWrapper {
    return mountWrapper.find("div").filterWhere((w) => w.props().className === styles.chooser);
  }

  const testContent = <p>Chooser content</p>;

  it("should render as a button", () => {
    mountWrapper = mount(<ButtonDropDown icon={faRocket} text={"Test"} />);
    mountWrapper.find(IconBtn).length.should.equal(1);
    mountWrapper.text().should.equal("Test");
  });

  it("should pass down additional button props to the HTML button", () => {
    mountWrapper = mount(<ButtonDropDown icon={faRocket} text={"Test"} btnProps={{ disabled: true }} />);
    mountWrapper
      .find(IconBtn)
      .props()
      .btnProps.disabled.should.equal(true);
  });

  it("should pass down additional button props to the icon", () => {
    mountWrapper = mount(<ButtonDropDown icon={faRocket} text={"Test"} iconProps={{ spin: true }} />);
    mountWrapper
      .find(FontAwesomeIcon)
      .props()
      .spin.should.equal(true);
  });

  it("should call the handler when clicked", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<ButtonDropDown icon={faRocket} text={"Test"} onBtnClick={spy} />);
    mountWrapper.simulate("click");
    spy.calledOnce.should.equal(true);
  });

  it("should render the chooser content when provided", () => {
    mountWrapper = mount(<ButtonDropDown icon={faRocket} text={"Test"} dropDownContents={testContent} />);
    findChooser()
      .html()
      .should.contain("<p>");
    findChooser()
      .text()
      .should.equal("Chooser content");
  });
});
