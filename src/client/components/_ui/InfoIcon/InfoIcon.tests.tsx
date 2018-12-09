import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { should } from "chai";
import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { testGlobals } from "../../../../../test-utils/global.tests";
import { InfoIcon } from "./InfoIcon";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should render an info icon", () => {
		mountWrapper = mount(<InfoIcon hoverText={"hello"}/>);
		mountWrapper.find(FontAwesomeIcon).should.have.lengthOf(1);
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faInfoCircle);
	});

	it("should add the tooltip text", () => {
		mountWrapper = mount(<InfoIcon hoverText={"hello"}/>);
		mountWrapper.find("span").prop("data-tooltip").should.equal("hello");
	});
});
