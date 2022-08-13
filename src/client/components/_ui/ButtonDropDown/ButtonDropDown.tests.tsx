import { mount, ReactWrapper } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../test-utils/global.tests";
import { IconBtn } from "../IconBtn/IconBtn";
import { MaterialIcon } from "../MaterialIcon/MaterialIcon";
import { removeIconText } from "../../../../test-utils/test-helpers";
import { ButtonDropDown } from "./ButtonDropDown";
import * as styles from "./ButtonDropDown.scss";

describe(__filename, () => {
  let { mountWrapper } = testGlobals;

  function findChooser(): ReactWrapper {
    return mountWrapper.find("div").filterWhere((w) => w.props().className === styles.chooser);
  }

  const testContent = <p>Chooser content</p>;

  it("should render as a button", () => {
    mountWrapper = mount(<ButtonDropDown icon={"rocket"} text={"Test"} />);
    removeIconText(mountWrapper);
    mountWrapper.find(IconBtn).length.should.equal(1);
    mountWrapper.text().should.equal("Test");
  });

  it("should pass down additional button props to the HTML button", () => {
    mountWrapper = mount(<ButtonDropDown icon={"rocket"} text={"Test"} btnProps={{ disabled: true }} />);
    mountWrapper
      .find(IconBtn)
      .props()
      .btnProps.disabled.should.equal(true);
  });

  it("should pass down additional button props to the icon", () => {
    mountWrapper = mount(<ButtonDropDown icon={"rocket"} text={"Test"} iconProps={{ spin: true }} />);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .spin.should.equal(true);
  });

  it("should render the chooser at a fixed position", () => {
    mountWrapper = mount(
      <ButtonDropDown icon={"rocket"} text={"Test"} dropDownContents={testContent} placement={"left"} />,
    );
    mountWrapper.instance().forceUpdate(); // makes sure the DOM ref is registered
    findChooser()
      .html()
      .should.contain("left:");

    mountWrapper = mount(
      <ButtonDropDown icon={"rocket"} text={"Test"} dropDownContents={testContent} placement={"right"} />,
    );
    mountWrapper.instance().forceUpdate(); // makes sure the DOM ref is registered
    findChooser()
      .html()
      .should.contain("right:");
  });

  it("should call the handler when clicked", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<ButtonDropDown icon={"rocket"} text={"Test"} onBtnClick={spy} />);
    mountWrapper.simulate("click");
    spy.calledOnce.should.equal(true);
  });

  it("should render the chooser content when provided", () => {
    mountWrapper = mount(<ButtonDropDown icon={"rocket"} text={"Test"} dropDownContents={testContent} />);
    findChooser()
      .html()
      .should.contain("<p>");
    findChooser()
      .text()
      .should.equal("Chooser content");
  });
});
