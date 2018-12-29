import { faCaretDown, faCaretUp } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { testGlobals } from "../../../../test-utils/global.tests";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { RelativeChangeIcon } from "./RelativeChangeIcon";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should render nothing when the change is == 0", () => {
		mountWrapper = mount(<RelativeChangeIcon change={0}/>);
		mountWrapper.find(FontAwesomeIcon).length.should.equal(0);
	});

	it("should render a green up icon when the change is > 0", () => {
		mountWrapper = mount(<RelativeChangeIcon change={1}/>);
		mountWrapper.find(FontAwesomeIcon).length.should.equal(1);
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faCaretUp);
		mountWrapper.find(FontAwesomeIcon).props().className.should.contain(bs.textSuccess);
	});

	it("should render a red down icon when the change is < 0", () => {
		mountWrapper = mount(<RelativeChangeIcon change={-1}/>);
		mountWrapper.find(FontAwesomeIcon).length.should.equal(1);
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faCaretDown);
		mountWrapper.find(FontAwesomeIcon).props().className.should.contain(bs.textDanger);
	});

	it("should apply extra props to the icon", () => {
		mountWrapper = mount(<RelativeChangeIcon change={1} iconProps={{ spin: true }}/>);
		mountWrapper.find(FontAwesomeIcon).props().spin.should.equal(true);
	});

	it("should not overwrite the class name when extra props specify one", () => {
		mountWrapper = mount(<RelativeChangeIcon change={1} iconProps={{ className: "test-class" }}/>);
		mountWrapper.find(FontAwesomeIcon).props().className.should.contain(bs.textSuccess);
		mountWrapper.find(FontAwesomeIcon).props().className.should.contain("test-class");
	});
});
