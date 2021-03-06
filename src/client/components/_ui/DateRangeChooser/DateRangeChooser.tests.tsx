import { mount, ReactWrapper } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { startOfMonth, addDays, endOfMonth, isSameDay, parseISO } from "date-fns";
import { testGlobals } from "../../../../test-utils/global.tests";
import { formatDate } from "../../../helpers/formatters";
import { ControlledDateInput } from "../ControlledInputs/ControlledDateInput";
import { IconBtn, IIconBtnProps } from "../IconBtn/IconBtn";
import * as styles from "../ButtonDropDown/ButtonDropDown.scss";
import { DateRangeChooser } from "./DateRangeChooser";

describe(__filename, () => {
  let { mountWrapper } = testGlobals;

  const monthStart = startOfMonth(new Date()).getTime();
  const monthStartPlus1Day = addDays(monthStart, 1).getTime();
  const monthEnd = endOfMonth(new Date()).getTime();

  function findChooser(): ReactWrapper {
    return mountWrapper.find("div").filterWhere((w) => w.props().className === styles.chooser);
  }

  function findCustomRangeSubmit(): ReactWrapper<IIconBtnProps> {
    return mountWrapper.find(IconBtn).filterWhere((w) => w.text() === "OK");
  }

  it("should render as a button", () => {
    mountWrapper = mount(<DateRangeChooser />);
    mountWrapper.find(IconBtn).length.should.equal(1);
  });

  it("should pass down additional props to the button drop down", () => {
    mountWrapper = mount(<DateRangeChooser dropDownProps={{ btnProps: { disabled: true } }} />);
    mountWrapper
      .find(IconBtn)
      .props()
      .btnProps.disabled.should.equal(true);
  });

  it("should show the selected date (preset date)", () => {
    mountWrapper = mount(<DateRangeChooser startDate={monthStart} endDate={monthEnd} />);
    mountWrapper.text().should.include("This Month");
  });

  it("should show the selected date (exact dates)", () => {
    mountWrapper = mount(<DateRangeChooser startDate={monthStartPlus1Day} endDate={monthEnd} />);
    mountWrapper.text().should.include(`${formatDate(monthStartPlus1Day)} to ${formatDate(monthEnd)}`);
  });

  it("should open the chooser when clicked", () => {
    mountWrapper = mount(<DateRangeChooser />);
    mountWrapper.simulate("click");
    findChooser().length.should.equal(1);
  });

  it("should close the chooser when clicked again", () => {
    mountWrapper = mount(<DateRangeChooser />);
    mountWrapper.simulate("click");
    findChooser().length.should.equal(1);
    mountWrapper.simulate("click");
    findChooser().length.should.equal(0);
  });

  it("should close the chooser when cancelled", () => {
    mountWrapper = mount(<DateRangeChooser />);
    mountWrapper.simulate("click");
    findChooser().length.should.equal(1);
    findChooser()
      .find("button")
      .filterWhere((w) => w.text() === "Cancel")
      .simulate("click");
    findChooser().length.should.equal(0);
  });

  it("should render all presets by default", () => {
    mountWrapper = mount(<DateRangeChooser />);
    mountWrapper.simulate("click");
    const text = findChooser().text();
    text.should.contain("This Month");
    text.should.contain("This Year");
    text.should.contain("Next Month");
    text.should.contain("Next Year");
    text.should.contain("Year to Date");
    text.should.contain("All Time");
  });

  it("should not render disabled presets", () => {
    mountWrapper = mount(<DateRangeChooser includeCurrentPresets={false} />);
    mountWrapper.simulate("click");
    findChooser()
      .text()
      .should.not.contain("This Month");
    findChooser()
      .text()
      .should.not.contain("This Year");

    mountWrapper = mount(<DateRangeChooser includeAllTimePreset={false} />);
    mountWrapper.simulate("click");
    findChooser()
      .text()
      .should.not.contain("All Time");

    mountWrapper = mount(<DateRangeChooser includeYearToDatePreset={false} />);
    mountWrapper.simulate("click");
    findChooser()
      .text()
      .should.not.contain("Year to Date");

    mountWrapper = mount(<DateRangeChooser includeFuturePresets={false} />);
    mountWrapper.simulate("click");
    findChooser()
      .text()
      .should.not.contain("Next Month");
    findChooser()
      .text()
      .should.not.contain("Next Year");
  });

  it("should render custom presets", () => {
    const now = new Date().getTime();
    mountWrapper = mount(<DateRangeChooser customPresets={[{ label: "Custom", startDate: now, endDate: now }]} />);
    mountWrapper.simulate("click");
    findChooser()
      .text()
      .should.contain("Custom");
  });

  it("should call the listener when a preset is selected", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<DateRangeChooser onValueChange={spy} />);
    mountWrapper.simulate("click");
    findChooser()
      .find("button")
      .filterWhere((w) => w.text() === "This Month")
      .simulate("click");
    spy.calledOnce.should.equal(true);
    isSameDay(spy.firstCall.args[0], monthStart).should.equal(true);
    isSameDay(spy.firstCall.args[1], monthEnd).should.equal(true);
  });

  it("should close the chooser when a preset is selected", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<DateRangeChooser onValueChange={spy} />);
    mountWrapper.simulate("click");
    findChooser()
      .find("button")
      .filterWhere((w) => w.text() === "This Month")
      .simulate("click");
    findChooser().length.should.equal(0);
  });

  it("should not show the custom range input by default", () => {
    mountWrapper = mount(<DateRangeChooser />);
    mountWrapper.simulate("click");
    findChooser()
      .find(ControlledDateInput)
      .length.should.equal(0);
  });

  it("should show the custom range input when in custom mode", () => {
    mountWrapper = mount(<DateRangeChooser />);
    mountWrapper.simulate("click");
    findChooser()
      .find("button")
      .filterWhere((w) => w.text() === "Custom")
      .simulate("click");
    findChooser()
      .find(ControlledDateInput)
      .length.should.equal(2);
  });

  it("should disable the custom range submit if no dates are given", () => {
    mountWrapper = mount(<DateRangeChooser />);
    mountWrapper.simulate("click");
    findChooser()
      .find("button")
      .filterWhere((w) => w.text() === "Custom")
      .simulate("click");
    findCustomRangeSubmit()
      .props()
      .btnProps.disabled.should.equal(true);
  });

  it("should disable the custom range submit if only a start date is given", () => {
    mountWrapper = mount(<DateRangeChooser />);
    mountWrapper.simulate("click");
    findChooser()
      .find("button")
      .filterWhere((w) => w.text() === "Custom")
      .simulate("click");
    findChooser()
      .find(ControlledDateInput)
      .at(0)
      .find("input")
      .simulate("change", { target: { value: "2015-04-01" } });
    findCustomRangeSubmit()
      .props()
      .btnProps.disabled.should.equal(true);
  });

  it("should disable the custom range submit if only an end date is given", () => {
    mountWrapper = mount(<DateRangeChooser />);
    mountWrapper.simulate("click");
    findChooser()
      .find("button")
      .filterWhere((w) => w.text() === "Custom")
      .simulate("click");
    findChooser()
      .find(ControlledDateInput)
      .at(1)
      .find("input")
      .simulate("change", { target: { value: "2015-04-01" } });
    findCustomRangeSubmit()
      .props()
      .btnProps.disabled.should.equal(true);
  });

  it("should disable the custom range submit if an invalid date range is given", () => {
    mountWrapper = mount(<DateRangeChooser />);
    mountWrapper.simulate("click");
    findChooser()
      .find("button")
      .filterWhere((w) => w.text() === "Custom")
      .simulate("click");
    findChooser()
      .find(ControlledDateInput)
      .at(0)
      .find("input")
      .simulate("change", { target: { value: "2015-04-02" } });
    findChooser()
      .find(ControlledDateInput)
      .at(1)
      .find("input")
      .simulate("change", { target: { value: "2015-04-01" } });
    findCustomRangeSubmit()
      .props()
      .btnProps.disabled.should.equal(true);
  });

  it("should call the listener when a custom range is submitted", () => {
    const spy = sinon.spy();
    mountWrapper = mount(<DateRangeChooser onValueChange={spy} />);
    mountWrapper.simulate("click");
    findChooser()
      .find("button")
      .filterWhere((w) => w.text() === "Custom")
      .simulate("click");
    findChooser()
      .find(ControlledDateInput)
      .at(0)
      .find("input")
      .simulate("change", { target: { value: "2015-04-01" } });
    findChooser()
      .find(ControlledDateInput)
      .at(1)
      .find("input")
      .simulate("change", { target: { value: "2015-04-02" } });
    findCustomRangeSubmit()
      .props()
      .btnProps.disabled.should.equal(false);
    findCustomRangeSubmit().simulate("click");
    spy.calledOnce.should.equal(true);
    isSameDay(spy.firstCall.args[0], parseISO("2015-04-01").getTime()).should.equal(true);
    isSameDay(spy.firstCall.args[1], parseISO("2015-04-02").getTime()).should.equal(true);
  });

  it("should keep the custom range chooser open when a custom range was last selected", () => {
    mountWrapper = mount(<DateRangeChooser />);
    // open the chooser and set a custom range
    mountWrapper.simulate("click");
    findChooser()
      .find("button")
      .filterWhere((w) => w.text() === "Custom")
      .simulate("click");
    findChooser()
      .find(ControlledDateInput)
      .at(0)
      .find("input")
      .simulate("change", { target: { value: "2015-04-01" } });
    findChooser()
      .find(ControlledDateInput)
      .at(1)
      .find("input")
      .simulate("change", { target: { value: "2015-04-02" } });
    findCustomRangeSubmit().simulate("click");

    // re-open the chooser
    mountWrapper.simulate("click");

    findChooser()
      .find(ControlledDateInput)
      .length.should.equal(2);
  });

  it("should close the custom range chooser when a preset range was last selected", () => {
    mountWrapper = mount(<DateRangeChooser />);
    // open the chooser and set a custom range
    mountWrapper.simulate("click");
    findChooser()
      .find("button")
      .filterWhere((w) => w.text() === "Custom")
      .simulate("click");
    findChooser()
      .find(ControlledDateInput)
      .at(0)
      .find("input")
      .simulate("change", { target: { value: "2015-04-01" } });
    findChooser()
      .find(ControlledDateInput)
      .at(1)
      .find("input")
      .simulate("change", { target: { value: "2015-04-02" } });
    findCustomRangeSubmit().simulate("click");

    // open the chooser and set a preset range
    mountWrapper.simulate("click");
    findChooser()
      .find("button")
      .filterWhere((w) => w.text() === "This Month")
      .simulate("click");

    // re-open the chooser
    mountWrapper.simulate("click");

    findChooser()
      .find(ControlledDateInput)
      .length.should.equal(0);
  });
});
