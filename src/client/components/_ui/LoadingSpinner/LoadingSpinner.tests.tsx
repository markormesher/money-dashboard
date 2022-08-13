import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { testGlobals } from "../../../../test-utils/global.tests";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { MaterialIcon } from "../MaterialIcon/MaterialIcon";
import { LoadingSpinner } from "./LoadingSpinner";

describe(__filename, () => {
  let { mountWrapper } = testGlobals;

  it("should render a spinner", () => {
    mountWrapper = mount(<LoadingSpinner />);
    mountWrapper.find(MaterialIcon).should.have.lengthOf(1);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .icon.should.equal("hourglass_empty");
    mountWrapper
      .find(MaterialIcon)
      .props()
      .spin.should.equal(true);
  });

  it("wrap in a centring div when centre=true", () => {
    mountWrapper = mount(<LoadingSpinner centre={true} />);
    mountWrapper.find("div").should.have.lengthOf(1);
    mountWrapper
      .find("div")
      .props()
      .className.should.contain(bs.textCenter);
    mountWrapper.find(MaterialIcon).should.have.lengthOf(1);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .icon.should.equal("hourglass_empty");
    mountWrapper
      .find(MaterialIcon)
      .props()
      .spin.should.equal(true);
  });
});
