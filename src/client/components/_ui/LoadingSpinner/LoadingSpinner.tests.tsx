import { faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { testGlobals } from "../../../../test-utils/global.tests";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { LoadingSpinner } from "./LoadingSpinner";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should render a spinner", () => {
		mountWrapper = mount(<LoadingSpinner/>);
		mountWrapper.find(FontAwesomeIcon).should.have.lengthOf(1);
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faCircleNotch);
		mountWrapper.find(FontAwesomeIcon).props().spin.should.equal(true);
	});

	it("wrap in a centring div when centre=true", () => {
		mountWrapper = mount(<LoadingSpinner centre={true}/>);
		mountWrapper.find("div").should.have.lengthOf(1);
		mountWrapper.find("div").props().className.should.equal(bs.textCenter);
		mountWrapper.find(FontAwesomeIcon).should.have.lengthOf(1);
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faCircleNotch);
		mountWrapper.find(FontAwesomeIcon).props().spin.should.equal(true);
	});
});
