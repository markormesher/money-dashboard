import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { testGlobals } from "../../../../test-utils/global.tests";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { MaterialIcon } from "../MaterialIcon/MaterialIcon";
import { RelativeChangeIcon } from "./RelativeChangeIcon";

describe(__filename, () => {
  let { mountWrapper } = testGlobals;

  it("should render nothing when the change is == 0", () => {
    mountWrapper = mount(<RelativeChangeIcon change={0} />);
    mountWrapper.find(MaterialIcon).length.should.equal(0);
  });

  it("should render a green up icon when the change is > 0", () => {
    mountWrapper = mount(<RelativeChangeIcon change={1} />);
    mountWrapper.find(MaterialIcon).length.should.equal(1);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .icon.should.equal("trending_up");
    mountWrapper
      .find(MaterialIcon)
      .props()
      .className.should.contain(bs.textSuccess);
  });

  it("should render a red down icon when the change is < 0", () => {
    mountWrapper = mount(<RelativeChangeIcon change={-1} />);
    mountWrapper.find(MaterialIcon).length.should.equal(1);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .icon.should.equal("trending_down");
    mountWrapper
      .find(MaterialIcon)
      .props()
      .className.should.contain(bs.textDanger);
  });

  it("should apply extra props to the icon", () => {
    mountWrapper = mount(<RelativeChangeIcon change={1} iconProps={{ spin: true }} />);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .spin.should.equal(true);
  });

  it("should not overwrite the class name when extra props specify one", () => {
    mountWrapper = mount(<RelativeChangeIcon change={1} iconProps={{ className: "test-class" }} />);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .className.should.contain(bs.textSuccess);
    mountWrapper
      .find(MaterialIcon)
      .props()
      .className.should.contain("test-class");
  });
});
