import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { testGlobals } from "../../../../test-utils/global.tests";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { Badge } from "./Badge";

describe(__filename, () => {
  let { mountWrapper } = testGlobals;

  it("should render children", () => {
    mountWrapper = mount(
      <Badge>
        <span>he</span>
        <span>llo</span>
      </Badge>,
    );
    mountWrapper.text().should.equal("hello");
  });

  it("should apply the given class", () => {
    mountWrapper = mount(<Badge className={bs.bgInfo}>hello</Badge>);
    mountWrapper
      .find("span")
      .hasClass(bs.bgInfo)
      .should.equal(true);
  });

  it("should apply a right margin if requested", () => {
    mountWrapper = mount(<Badge marginRight={true}>hello</Badge>);
    mountWrapper
      .find("span")
      .hasClass(bs.me1)
      .should.equal(true);
  });

  it("should apply a left margin if requested", () => {
    mountWrapper = mount(<Badge marginLeft={true}>hello</Badge>);
    mountWrapper
      .find("span")
      .hasClass(bs.ms1)
      .should.equal(true);
  });
});
