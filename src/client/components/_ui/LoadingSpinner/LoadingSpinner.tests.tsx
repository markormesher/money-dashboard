import { faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { testGlobals } from "../../../../../test/global.tests";
import { LoadingSpinner } from "./LoadingSpinner";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should render a spinner", () => {
		mountWrapper = mount(<LoadingSpinner/>);
		mountWrapper.find(FontAwesomeIcon).should.have.lengthOf(1);
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faCircleNotch);
		mountWrapper.find(FontAwesomeIcon).props().spin.should.equal(true);
	});
});
