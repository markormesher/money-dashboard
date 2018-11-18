import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { testGlobals } from "../../../../../test/global.tests";
import { BufferedTextInput } from "../BufferedTextInput/BufferedTextInput";
import { PagerBtns } from "../PagerBtns/PagerBtns";
import { DataTableOuterHeader } from "./DataTableOuterHeader";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should passes props to its children", () => {
		const pageChangeHandler = () => {
			return;
		};
		const searchTermChangeHandler = () => {
			return;
		};
		mountWrapper = mount((
				<DataTableOuterHeader
						loading={true}
						currentPage={2}
						pageSize={15}
						rowCount={42}
						onPageChange={pageChangeHandler}
						onSearchTermChange={searchTermChangeHandler}
				/>
		));
		const header = mountWrapper.find(DataTableOuterHeader);
		const pagerBtns = mountWrapper.find(PagerBtns);
		const searchInput = mountWrapper.find(BufferedTextInput);

		pagerBtns.props().disabled.should.equal(header.props().loading);
		pagerBtns.props().currentPage.should.equal(header.props().currentPage);
		pagerBtns.props().onPageChange.should.equal(header.props().onPageChange);

		searchInput.props().onValueChange.should.equal(header.props().onSearchTermChange);
	});

	it("should calculate the correct page count", () => {
		mountWrapper = mount((<DataTableOuterHeader loading={false} currentPage={0} pageSize={15} rowCount={0}/>));
		mountWrapper.find(PagerBtns).props().totalPages.should.equal(0);

		mountWrapper = mount((<DataTableOuterHeader loading={false} currentPage={0} pageSize={15} rowCount={14}/>));
		mountWrapper.find(PagerBtns).props().totalPages.should.equal(1);

		mountWrapper = mount((<DataTableOuterHeader loading={false} currentPage={0} pageSize={15} rowCount={15}/>));
		mountWrapper.find(PagerBtns).props().totalPages.should.equal(1);

		mountWrapper = mount((<DataTableOuterHeader loading={false} currentPage={0} pageSize={15} rowCount={16}/>));
		mountWrapper.find(PagerBtns).props().totalPages.should.equal(2);

		mountWrapper = mount((<DataTableOuterHeader loading={false} currentPage={0} pageSize={15} rowCount={150}/>));
		mountWrapper.find(PagerBtns).props().totalPages.should.equal(10);
	});
});
