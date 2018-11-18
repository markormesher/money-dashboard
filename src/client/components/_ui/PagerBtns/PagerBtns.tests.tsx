import { faArrowLeft, faArrowRight } from "@fortawesome/pro-light-svg-icons";
import { should } from "chai";
import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../../test/global.tests";
import { IconBtn } from "../IconBtn/IconBtn";
import { PagerBtns } from "./PagerBtns";

// NB: currentPage is 0-indexed

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should display the correct summary when pages > 0", () => {
		mountWrapper = mount(<PagerBtns currentPage={0} totalPages={10}/>);
		mountWrapper.text().should.equal("Page 1 of 10");

		mountWrapper = mount(<PagerBtns currentPage={1} totalPages={10}/>);
		mountWrapper.text().should.equal("Page 2 of 10");
	});

	it("should display the correct summary when pages == 0", () => {
		mountWrapper = mount(<PagerBtns currentPage={0} totalPages={0}/>);
		mountWrapper.text().should.equal("Page 0 of 0");

		mountWrapper = mount(<PagerBtns currentPage={10} totalPages={0}/>);
		mountWrapper.text().should.equal("Page 0 of 0");
	});

	it("should disable both buttons when requested", () => {
		mountWrapper = mount(<PagerBtns disabled={true} currentPage={0} totalPages={10}/>);
		mountWrapper.find("button").forEach((btn) => {
			btn.props().disabled.should.equal(true);
		});
	});

	it("should disable both buttons when pages == 0", () => {
		mountWrapper = mount(<PagerBtns currentPage={0} totalPages={0}/>);
		mountWrapper.find("button").forEach((btn) => {
			btn.props().disabled.should.equal(true);
		});
	});

	it("should disable the prev button when at the startDate", () => {
		mountWrapper = mount(<PagerBtns currentPage={0} totalPages={10}/>);
		mountWrapper.find(IconBtn).forEach((btn) => {
			if (btn.props().icon === faArrowLeft) {
				btn.find("button").props().disabled.should.equal(true);
			}
		});
	});

	it("should disable the next button when at the endDate", () => {
		mountWrapper = mount(<PagerBtns currentPage={9} totalPages={10}/>);
		mountWrapper.find(IconBtn).forEach((btn) => {
			if (btn.props().icon === faArrowRight) {
				btn.find("button").props().disabled.should.equal(true);
			}
		});
	});

	it("should not disable the prev button prev pages are available", () => {
		mountWrapper = mount(<PagerBtns currentPage={5} totalPages={10}/>);
		mountWrapper.find(IconBtn).forEach((btn) => {
			if (btn.props().icon === faArrowLeft) {
				btn.find("button").props().disabled.should.equal(false);
			}
		});
	});

	it("should not disable the next button next pages are available", () => {
		mountWrapper = mount(<PagerBtns currentPage={5} totalPages={10}/>);
		mountWrapper.find(IconBtn).forEach((btn) => {
			if (btn.props().icon === faArrowRight) {
				btn.find("button").props().disabled.should.equal(false);
			}
		});
	});

	it("should call the listener with the prev page when the prev button is clicked", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<PagerBtns currentPage={5} totalPages={10} onPageChange={spy}/>);
		mountWrapper.find(IconBtn).forEach((btn) => {
			if (btn.props().icon === faArrowLeft) {
				btn.find("button").simulate("click");
			}
		});
		spy.calledOnceWithExactly(4).should.equal(true);
	});

	it("should call the listener with the next page when the next button is clicked", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<PagerBtns currentPage={5} totalPages={10} onPageChange={spy}/>);
		mountWrapper.find(IconBtn).forEach((btn) => {
			if (btn.props().icon === faArrowRight) {
				btn.find("button").simulate("click");
			}
		});
		spy.calledOnceWithExactly(6).should.equal(true);
	});

	it("should not call the listener when the prev button is clicked at the startDate", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<PagerBtns currentPage={0} totalPages={10} onPageChange={spy}/>);
		mountWrapper.find(IconBtn).forEach((btn) => {
			if (btn.props().icon === faArrowLeft) {
				btn.find("button").simulate("click");
			}
		});
		spy.notCalled.should.equal(true);
	});

	it("should not call the listener when the next button is clicked at the endDate", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<PagerBtns currentPage={9} totalPages={10} onPageChange={spy}/>);
		mountWrapper.find(IconBtn).forEach((btn) => {
			if (btn.props().icon === faArrowRight) {
				btn.find("button").simulate("click");
			}
		});
		spy.notCalled.should.equal(true);
	});
});