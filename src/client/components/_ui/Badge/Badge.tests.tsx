import { should } from "chai";
import { mount, render } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { testGlobals } from "../../../../../test/global.tests";
import * as bs from "../../../bootstrap-aliases";
import { Badge } from "./Badge";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should render a single child", () => {
		const wrapper = render(<Badge>hello</Badge>);
		wrapper.text().should.equal("hello");
	});

	it("should render a single child", () => {
		mountWrapper = mount(<Badge><span>he</span><span>llo</span></Badge>);
		mountWrapper.text().should.equal("hello");
	});

	it("should apply the given class", () => {
		mountWrapper = mount(<Badge className={bs.badgeInfo}>hello</Badge>);
		mountWrapper.find("span").hasClass(bs.badgeInfo).should.equal(true);
	});

	it("should apply a margin if requested", () => {
		mountWrapper = mount(<Badge marginRight={true}>hello</Badge>);
		mountWrapper.find("span").hasClass(bs.mr1).should.equal(true);
	});
});
